package com.meetingscheduled.massad;

import android.app.Activity;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.PrintManager;
import android.util.Base64;
import androidx.activity.result.ActivityResult;
import androidx.core.content.FileProvider;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.UUID;

@CapacitorPlugin(name = "ReportFiles")
public class ReportFilesPlugin extends Plugin {
    @Override public void load() {
        File root = new File(getContext().getCacheDir(), "reports");
        File[] folders = root.listFiles();
        if (folders != null) for (File folder : folders) {
            if (System.currentTimeMillis() - folder.lastModified() > 86400000L) {
                File[] files = folder.listFiles();
                if (files != null) for (File file : files) file.delete();
                folder.delete();
            }
        }
    }

    @PluginMethod public void exportFile(PluginCall call) {
        try {
            String mode = call.getString("mode", "save");
            String mime = call.getString("mime", "application/octet-stream");
            String name = call.getString("name", "report.pdf").replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "-");
            if (name.trim().isEmpty() || name.length() > 220) throw new IllegalArgumentException();
            String data = call.getString("data");
            if (data == null || data.length() > 100_000_000) throw new IllegalArgumentException();
            File folder = new File(getContext().getCacheDir(), "reports/" + UUID.randomUUID());
            if (!folder.mkdirs()) throw new java.io.IOException();
            File file = new File(folder, name);
            try (FileOutputStream output = new FileOutputStream(file)) { output.write(Base64.decode(data, Base64.DEFAULT)); }
            call.getData().remove("data");
            call.getData().put("_exportPath", file.getAbsolutePath());
            if (mode.equals("save")) {
                Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType(mime);
                intent.putExtra(Intent.EXTRA_TITLE, name);
                startActivityForResult(call, intent, "documentCreated");
                return;
            }
            if (mode.equals("print")) {
                if (!mime.equals("application/pdf")) throw new IllegalArgumentException();
                getActivity().runOnUiThread(() -> {
                    try {
                        PrintManager manager = (PrintManager)getContext().getSystemService(Context.PRINT_SERVICE);
                        manager.print(name, new PdfAdapter(file), new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
                        call.resolve(new JSObject().put("opened", true));
                    } catch (Exception e) { call.reject("לא ניתן לפתוח הדפסה. אפשר לשמור או לשתף את ה־PDF."); }
                });
                return;
            }
            if (!mode.equals("share") && !mode.equals("email")) throw new IllegalArgumentException();
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(mime);
            intent.putExtra(Intent.EXTRA_STREAM, uri);
            intent.setClipData(ClipData.newRawUri(name, uri));
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.putExtra(Intent.EXTRA_SUBJECT, call.getString("subject", name));
            if (mode.equals("email")) {
                String recipient = call.getString("recipient", "");
                if (recipient.contains("\n") || recipient.contains("\r")) throw new IllegalArgumentException();
                intent.putExtra(Intent.EXTRA_EMAIL, new String[]{recipient});
                intent.putExtra(Intent.EXTRA_TEXT, call.getString("text", ""));
            }
            getActivity().startActivity(Intent.createChooser(intent, mode.equals("email") ? "בחירת אפליקציית מייל" : "שיתוף הדוח"));
            call.resolve(new JSObject().put("opened", true));
        } catch (Exception e) {
            call.reject("לא ניתן לפתוח את הפעולה. בדקו שיש אפליקציה מתאימה ומקום פנוי במכשיר.");
        }
    }

    @ActivityCallback private void documentCreated(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve(new JSObject().put("saved", false));
            return;
        }
        try (FileInputStream source = new FileInputStream(call.getString("_exportPath"));
             OutputStream target = getContext().getContentResolver().openOutputStream(result.getData().getData(), "wt")) {
            if (target == null) throw new java.io.IOException();
            copy(source, target, null);
            call.resolve(new JSObject().put("saved", true));
        } catch (Exception e) { call.reject("שמירת הקובץ לא הצליחה. נסו מקום אחר או בדקו מקום פנוי."); }
    }

    private static void copy(FileInputStream source, OutputStream target, CancellationSignal cancel) throws java.io.IOException {
        byte[] buffer = new byte[32768];
        int count;
        while ((count = source.read(buffer)) != -1) {
            if (cancel != null && cancel.isCanceled()) return;
            target.write(buffer, 0, count);
        }
        target.flush();
    }
    private static class PdfAdapter extends PrintDocumentAdapter {
        private final File file;
        PdfAdapter(File file) { this.file = file; }
        @Override public void onLayout(PrintAttributes oldAttrs, PrintAttributes newAttrs, CancellationSignal cancel, LayoutResultCallback callback, Bundle extras) {
            if (cancel.isCanceled()) { callback.onLayoutCancelled(); return; }
            callback.onLayoutFinished(new PrintDocumentInfo.Builder(file.getName()).setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT).setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN).build(), !newAttrs.equals(oldAttrs));
        }
        @Override public void onWrite(PageRange[] ranges, ParcelFileDescriptor destination, CancellationSignal cancel, WriteResultCallback callback) {
            try (FileInputStream source = new FileInputStream(file); FileOutputStream target = new FileOutputStream(destination.getFileDescriptor())) {
                copy(source, target, cancel);
                if (cancel.isCanceled()) callback.onWriteCancelled();
                else callback.onWriteFinished(new PageRange[]{PageRange.ALL_PAGES});
            } catch (Exception e) { callback.onWriteFailed("ההדפסה לא הצליחה"); }
        }
    }
}

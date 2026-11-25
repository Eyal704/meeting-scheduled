package com.meetingscheduled.massad;

import static org.junit.Assert.*;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiSelector;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.io.File;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/** Runs against the real Android WebView, native file picker and offline packaged assets. */
@RunWith(AndroidJUnit4.class)
public class OfflineReportTest {
    @Rule public ActivityScenarioRule<MainActivity> activity = new ActivityScenarioRule<>(MainActivity.class);
    private final UiDevice device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    private String js(String code) throws Exception {
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<String> value = new AtomicReference<>();
        activity.getScenario().onActivity(a -> a.getBridge().getWebView().evaluateJavascript(code, r -> {value.set(r);latch.countDown();}));
        assertTrue("JS callback timed out",latch.await(10,TimeUnit.SECONDS));
        return value.get();
    }
    private void until(String condition) throws Exception {
        long end=System.currentTimeMillis()+45000;
        while(System.currentTimeMillis()<end){if("true".equals(js(condition)))return;Thread.sleep(200);}
        fail("Condition timed out: "+condition+"; body="+js("document.body.innerText.slice(-300)"));
    }
    private void fill(String name,String value) throws Exception {
        js("(()=>{const e=document.querySelector('[data-path=\""+name+"\"]');e.value="+JSONObject.quote(value)+";e.dispatchEvent(new Event('input',{bubbles:true}));})()");
    }
    private void click(String selector) throws Exception {js("document.querySelector("+JSONObject.quote(selector)+").click()");}
    private void screenshot(String name) throws Exception {
        File dir=new File(InstrumentationRegistry.getInstrumentation().getTargetContext().getExternalFilesDir(null),"screenshots");dir.mkdirs();
        assertTrue(device.takeScreenshot(new File(dir,name+".png")));
    }
    @Test public void offlineHazardReportPersistsAndExports() throws Exception {
        String password=InstrumentationRegistry.getArguments().getString("access");
        assertNotNull("Pass the authorized entrance password as instrumentation argument access",password);
        device.executeShellCommand("svc wifi disable");
        device.executeShellCommand("svc data disable");
        until("document.readyState==='complete'&&!!document.querySelector('#access-password')&&!document.querySelector('#access-submit').disabled");
        js("document.querySelector('#access-password').value='invalid-test-password'");click("#access-submit");
        until("document.querySelector('#access-error').textContent.includes('שגויה')");
        js("document.querySelector('#access-password').value="+JSONObject.quote(password));click("#access-submit");
        until("document.querySelectorAll('[data-action=new]').length===4");
        assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
        screenshot("01-reports");
        click("[data-action=new][data-type=hazards]");
        until("!!document.querySelector('[data-path=site]')");
        fill("site","אתר הדרכה — דוח לדוגמה");fill("address","מבנה א׳");fill("inspector","ממונה בטיחות");
        click("#report-form button[type=submit]");
        until("!!document.querySelector('[data-path=reporter]')");
        fill("reporter","מדווח לדוגמה");fill("hazards.0.location","קומה 2, ליד גרם המדרגות");
        fill("hazards.0.category","מפגעים מכניים");fill("hazards.0.risk","גבוהה");fill("hazards.0.description","פתח ברצפה ללא כיסוי. יש לגדר את האזור עד להשלמת הטיפול.");
        fill("hazards.0.treatment","בטיפול");
        screenshot("02-hazard");
        click("#report-form button[type=submit]");
        until("!!document.querySelector('canvas[data-signature]')");
        js("document.querySelector('canvas').scrollIntoView({block:'center'})");Thread.sleep(500);
        JSONArray box = new JSONArray(js("(()=>{let r=document.querySelector('canvas').getBoundingClientRect();return [r.x,r.y,r.width,r.height,devicePixelRatio]})()"));
        double scale=box.getDouble(4);
        int x=(int)((box.getDouble(0)+50)*scale),y=(int)((box.getDouble(1)+60)*scale);
        device.swipe(x,y,x+(int)(90*scale),y+(int)(20*scale),20);
        until("!!current.signature");
        click("#report-form button[type=submit]");
        until("typeof pdfFile!=='undefined'&&pdfFile!==null");
        assertEquals("true",js("pdfFile.type==='application/pdf'&&pdfFile.size>10000"));
        js("pdfFile.slice(0,5).text().then(v=>window.pdfHeader=v)");until("window.pdfHeader==='%PDF-'");
        assertEquals("true",js("document.documentElement.scrollWidth<=innerWidth+1"));
        screenshot("03-report");
        // Real Android save picker: cancellation must leave report and PDF intact.
        click("[data-action=download]");
        assertTrue("Android document picker did not open",device.findObject(new UiSelector().packageName("com.google.android.documentsui")).waitForExists(10000) || device.findObject(new UiSelector().packageName("com.android.documentsui")).waitForExists(10000));
        screenshot("04-save-pdf");
        device.pressBack();
        until("!navigating");
        assertEquals("true",js("pdfFile!==null&&current.status==='ready'"));
        // Complete a real save too, and inspect the resulting file on the emulator.
        click("[data-action=download]");
        androidx.test.uiautomator.UiObject saveButton = device.findObject(new UiSelector().textMatches("(?i)save"));
        assertTrue("Save action missing from Android document picker", saveButton.waitForExists(10000));
        saveButton.click();
        until("!navigating&&document.querySelector('#toast').textContent.includes('ה־PDF נשמר')");
        String savedPdf = device.executeShellCommand("find /sdcard/Download -type f -name '*.pdf'").trim();
        assertTrue("No exported PDF in Downloads",savedPdf.endsWith(".pdf"));
        assertEquals("%PDF-",device.executeShellCommand("head -c 5 '"+savedPdf.replace("'","'\\''")+"'"));
        // Recreate the WebView: this proves IndexedDB survives an app activity restart.
        activity.getScenario().recreate();
        until("document.readyState==='complete'&&((!!document.querySelector('#access-password')&&!document.querySelector('#access-submit').disabled)||!!document.querySelector('.saved-row'))");
        if("true".equals(js("!!document.querySelector('#access-password')"))){
            js("document.querySelector('#access-password').value="+JSONObject.quote(password));click("#access-submit");
        }
        until("document.querySelectorAll('.saved-row').length===1");
        click("[data-action=open]");until("typeof pdfFile!=='undefined'&&pdfFile!==null");
        assertEquals("true",js("current.reporter==='מדווח לדוגמה'&&current.hazards[0].risk==='גבוהה'&&!!current.signature"));
        // Backup is also an actual Android document export, not a blob URL download.
        click("[data-action=home]");until("!!document.querySelector('[data-action=backup]')");
        js("document.querySelector('.backup-panel').open=true");click("[data-action=backup]");
        assertTrue(device.findObject(new UiSelector().textContains("massad-backup-")).waitForExists(10000));
        device.pressBack();until("!navigating");
        click("[data-lock]");until("document.readyState==='complete'&&!!document.querySelector('#access-password')&&!document.querySelector('#access-submit').disabled");
    }
}

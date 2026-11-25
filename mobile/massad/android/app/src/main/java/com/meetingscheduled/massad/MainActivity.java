package com.meetingscheduled.massad;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(ReportFilesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}

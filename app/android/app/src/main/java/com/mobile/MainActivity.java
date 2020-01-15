package com.mobile;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
import android.os.Bundle; // required for onCreate parameter
import android.os.CountDownTimer;
import android.graphics.Color;

public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "mobile";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set the Android background to white after 8 seconds 
        // to fix the splashscreen flash when the keyboard is shown
        new CountDownTimer(8000, 1000) {
            public void onTick(long millisUntilFinished) {}

            public void onFinish() {
                getWindow().getDecorView().setBackgroundColor(Color.parseColor("#f5f5f5"));
            }
        }.start();
    }
}

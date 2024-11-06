package com.example.medkado

import android.content.Context
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.viewinterop.AndroidView
import com.chaquo.python.Python
import com.chaquo.python.android.AndroidPlatform
import java.io.File

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true)

        setContent {
            MaterialTheme {
                Scaffold { innerPadding ->
                    WebViewScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
        if (! Python.isStarted()) {
            Python.start(AndroidPlatform(this));
        }
        
    }
}

@Composable
fun WebViewScreen(modifier: Modifier = Modifier) {
    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = WebViewClient() // Handle page navigation within WebView
                settings.javaScriptEnabled = true // Enable JavaScript
                loadUrl("file:///android_asset/login-page.html") // Load the local HTML file
                addJavascriptInterface(WebAppInterface(context), "Android") // Attach JavaScript interface
            }
        },
        modifier = modifier.fillMaxSize() // Fill the available screen size
    )
}

class WebAppInterface(private val context: Context) {
    @JavascriptInterface
    fun saveUserDetails(jsonData: String) {
        val file = File(context.filesDir, "user_details.txt")
        file.writeText(jsonData) // Save user details as JSON text in the file
    }
    @JavascriptInterface
    fun saveApiResponse(authToken: String) {
        if (! Python.isStarted()) {
            Python.start(AndroidPlatform(this));
        }
        // Initialize Python if not already initialized        
        val python = Python.getInstance()
        val apiUtils = python.getModule("api_utils")

        val save_api_response = apiUtils["save_api_response"]
        val calling_api = save_api_response?.call(authToken)
}
}

@Preview(showBackground = true)
@Composable
fun WebViewPreview() {
    MaterialTheme {
        WebViewScreen()
    }
}

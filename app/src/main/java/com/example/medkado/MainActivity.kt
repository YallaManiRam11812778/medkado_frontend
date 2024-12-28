package com.example.medkado

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
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

    private lateinit var webView: WebView // Declare WebView as a member variable

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize Python if not already initialized
        if (!Python.isStarted()) {
            Python.start(AndroidPlatform(this))
        }

        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true)

        setContent {
            MaterialTheme {
                Scaffold { innerPadding ->
                    WebViewScreen(modifier = Modifier.padding(innerPadding)) { createdWebView ->
                        webView = createdWebView // Initialize the WebView instance
                    }
                }
            }
        }
    }

    // Override the back button behavior
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack() // Navigate to the previous page in the WebView
        } else {
            super.onBackPressed() // Default back button behavior
        }
    }

    // Handle configuration changes
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        // Add any logic here if you want to handle orientation changes
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            Log.d("MainActivity", "Switched to Landscape")
        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {
            Log.d("MainActivity", "Switched to Portrait")
        }
    }
}

@Composable
fun WebViewScreen(modifier: Modifier = Modifier, onWebViewCreated: (WebView) -> Unit) {
    AndroidView(
        factory = { context ->
            WebView(context).apply {
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        // Open external links in the default browser
                        if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                            context.startActivity(intent)
                            return true // Indicate that the event is handled externally
                        }
                        return false // Allow WebView to handle internal URLs
                    }
                }

                settings.javaScriptEnabled = true // Enable JavaScript
                loadUrl("file:///android_asset/login-page.html") // Load the local HTML file
                addJavascriptInterface(WebAppInterface(context, this), "Android") // Attach JavaScript interface
                onWebViewCreated(this) // Pass the WebView instance to the caller
            }
        },
        modifier = modifier.fillMaxSize() // Fill the available screen size
    )
}

class WebAppInterface(private val context: Context, private val webView: WebView) {

    @JavascriptInterface
    fun saveUserDetails(jsonData: String) {
        val file = File(context.filesDir, "user_details.txt")
        file.writeText(jsonData) // Save user details as JSON text in the file
    }

    @JavascriptInterface
    fun saveApiResponse(authToken: String) {
        val python = Python.getInstance()
        val apiUtils = python.getModule("api_utils")
        val saveApiResponseTxt = apiUtils["save_api_response"]
        val response = saveApiResponseTxt?.call(authToken)
        Log.d("SaveApiResponse", "Response from Python: $response")
    }

    @JavascriptInterface
    fun getApiResponse(): String {
        val python = Python.getInstance()
        val apiUtils = python.getModule("api_utils")
        val getApiResponseFunction = apiUtils["get_api_response"]
        val responseForAuth = getApiResponseFunction?.call()
        val responseString = responseForAuth.toString()
        val escapedResponse = escapeString(responseString)
        return escapedResponse
    }

    // Function to escape special characters to prevent JavaScript errors
    private fun escapeString(input: String): String {
        return input.replace("'", "\\'")
    }
}

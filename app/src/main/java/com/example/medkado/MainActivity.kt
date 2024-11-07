package com.example.medkado

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
import android.content.Context
import android.util.Log
import android.widget.Toast

class MainActivity : ComponentActivity() {
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
                    WebViewScreen(modifier = Modifier.padding(innerPadding))
                }
            }
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
                addJavascriptInterface(WebAppInterface(context, this), "Android") // Attach JavaScript interface
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
    fun getApiResponse():String {
        val python = Python.getInstance()
        val apiUtils = python.getModule("api_utils")
        val getApiResponseFunction = apiUtils["get_api_response"]
        val responseForAuth = getApiResponseFunction?.call()
        val responseString = responseForAuth.toString()
        val escapedResponse = escapeString(responseString)
        return escapedResponse
        // Use WebView to call a JavaScript function with the response
        //webView?.evaluateJavascript("javascript:handleApiResponse('$escapedResponse')", null)
    }
    // Function to escape special characters to prevent JavaScript errors
    private fun escapeString(input: String): String {
        return input.replace("'", "\\'")
    }
}

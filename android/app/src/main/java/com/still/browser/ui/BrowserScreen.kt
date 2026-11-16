package com.still.browser.ui

import android.view.ViewGroup
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.viewmodel.compose.viewModel
import com.still.browser.BrowserViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BrowserScreen(viewModel: BrowserViewModel = viewModel()) {
    val tabs by viewModel.tabs.collectAsState()
    val activeTabId by viewModel.activeTabId.collectAsState()
    val currentUrl by viewModel.currentUrl.collectAsState()

    var urlInput by remember { mutableStateOf("") }
    var showAiPanel by remember { mutableStateOf(false) }
    var aiQuery by remember { mutableStateOf("") }
    var aiResponse by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .background(Color(0xFF0b0d10))
                    .fillMaxWidth()
            ) {
                // Tab strip
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .horizontalScroll(rememberScrollState())
                        .padding(horizontal = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF6366f1)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("s", color = Color.White, style = MaterialTheme.typography.titleMedium)
                    }

                    tabs.forEach { tab ->
                        val isActive = tab.id == activeTabId
                        Surface(
                            onClick = { viewModel.selectTab(tab.id) },
                            color = if (isActive) Color(0xFF1a1e24) else Color.Transparent,
                            shape = RoundedCornerShape(topStart = 8.dp, topEnd = 8.dp),
                            modifier = Modifier.height(40.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Text(
                                    text = tab.title,
                                    color = if (isActive) Color.White else Color(0xFF9ca3af),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.widthIn(max = 120.dp)
                                )
                                if (tabs.size > 1) {
                                    IconButton(
                                        onClick = { viewModel.closeTab(tab.id) },
                                        modifier = Modifier.size(16.dp)
                                    ) {
                                        Icon(
                                            Icons.Default.Close,
                                            contentDescription = "Close tab",
                                            tint = Color(0xFF9ca3af)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    IconButton(onClick = { viewModel.newTab() }) {
                        Icon(Icons.Default.Add, contentDescription = "New tab", tint = Color.White)
                    }
                }

                // Navigation bar
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    IconButton(onClick = { /* Back */ }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF9ca3af))
                    }
                    IconButton(onClick = { /* Forward */ }) {
                        Icon(Icons.Default.ArrowForward, contentDescription = "Forward", tint = Color(0xFF9ca3af))
                    }
                    IconButton(onClick = { /* Reload */ }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Reload", tint = Color(0xFF9ca3af))
                    }

                    OutlinedTextField(
                        value = urlInput.ifEmpty { currentUrl },
                        onValueChange = { urlInput = it },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        placeholder = { Text("Search or enter address", color = Color(0xFF6b7280)) },
                        singleLine = true,
                        shape = RoundedCornerShape(24.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF6366f1),
                            unfocusedBorderColor = Color(0xFF27272a),
                            focusedContainerColor = Color(0xFF14171d),
                            unfocusedContainerColor = Color(0xFF14171d),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        trailingIcon = {
                            IconButton(onClick = {
                                val target = if (urlInput.startsWith("http")) urlInput else "https://duckduckgo.com/?q=$urlInput"
                                viewModel.navigate(target)
                                urlInput = ""
                            }) {
                                Icon(Icons.Default.Search, contentDescription = "Navigate", tint = Color(0xFF9ca3af))
                            }
                        }
                    )

                    Button(
                        onClick = { showAiPanel = !showAiPanel },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF6366f1))
                    ) {
                        Text("AI", color = Color.White)
                    }
                }
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFF0b0d10))
        ) {
            val activeTab = tabs.find { it.id == activeTabId }
            if (activeTab?.url == "about:blank" || activeTab?.url.isNullOrEmpty()) {
                // Home view
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "The internet, at your pace.",
                        style = MaterialTheme.typography.headlineLarge,
                        color = Color.White
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Find what you need. Keep what matters. Leave the noise behind.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = Color(0xFF9ca3af)
                    )
                }
            } else {
                // WebView
                AndroidView(
                    factory = { context ->
                        WebView(context).apply {
                            layoutParams = ViewGroup.LayoutParams(
                                ViewGroup.LayoutParams.MATCH_PARENT,
                                ViewGroup.LayoutParams.MATCH_PARENT
                            )
                            webViewClient = WebViewClient()
                            settings.javaScriptEnabled = true
                            settings.domStorageEnabled = true
                        }
                    },
                    update = { webView ->
                        if (!activeTab?.url.isNullOrEmpty() && activeTab?.url != "about:blank") {
                            if (webView.url != activeTab?.url) {
                                webView.loadUrl(activeTab!!.url)
                            }
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }

            // AI Assistant Panel Overlay
            if (showAiPanel) {
                Surface(
                    modifier = Modifier
                        .align(Alignment.CenterEnd)
                        .fillMaxHeight()
                        .width(360.dp),
                    color = Color(0xFF14171d),
                    tonalElevation = 8.dp
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("AI Assistant", style = MaterialTheme.typography.titleLarge, color = Color.White)
                                IconButton(onClick = { showAiPanel = false }) {
                                    Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                                }
                            }
                            Spacer(modifier = Modifier.height(16.dp))
                            if (aiResponse.isNotEmpty()) {
                                Text(aiResponse, color = Color(0xFFd1d5db), style = MaterialTheme.typography.bodyMedium)
                            } else {
                                Text("Ask a question, explore an idea, or summarize this page.", color = Color(0xFF6b7280))
                            }
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = aiQuery,
                                onValueChange = { aiQuery = it },
                                modifier = Modifier.weight(1f),
                                placeholder = { Text("Message assistant...") },
                                singleLine = true
                            )
                            Button(onClick = {
                                aiResponse = "Thinking about: $aiQuery..."
                                aiQuery = ""
                            }) {
                                Text("Send")
                            }
                        }
                    }
                }
            }
        }
    }
}

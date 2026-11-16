package com.still.browser

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class BrowserTab(
    val id: String,
    val title: String,
    val url: String,
    val isLoading: Boolean = false
)

class BrowserViewModel(application: Application) : AndroidViewModel(application) {
    private val _tabs = MutableStateFlow<List<BrowserTab>>(
        listOf(BrowserTab(id = "1", title = "New tab", url = "about:blank"))
    )
    val tabs: StateFlow<List<BrowserTab>> = _tabs.asStateFlow()

    private val _activeTabId = MutableStateFlow("1")
    val activeTabId: StateFlow<String> = _activeTabId.asStateFlow()

    private val _currentUrl = MutableStateFlow("")
    val currentUrl: StateFlow<String> = _currentUrl.asStateFlow()

    fun navigate(url: String) {
        _currentUrl.value = url
        val currentId = _activeTabId.value
        _tabs.value = _tabs.value.map { tab ->
            if (tab.id == currentId) {
                tab.copy(url = url, title = url)
            } else {
                tab
            }
        }
    }

    fun newTab() {
        val newId = ((_tabs.value.maxOfOrNull { it.id.toIntOrNull() ?: 0 } ?: 0) + 1).toString()
        val newTabObj = BrowserTab(id = newId, title = "New tab", url = "about:blank")
        _tabs.value = _tabs.value + newTabObj
        _activeTabId.value = newId
        _currentUrl.value = ""
    }

    fun selectTab(id: String) {
        _activeTabId.value = id
        val tab = _tabs.value.find { it.id == id }
        _currentUrl.value = tab?.url ?: ""
    }

    fun closeTab(id: String) {
        val currentTabs = _tabs.value
        if (currentTabs.size <= 1) return
        val newTabs = currentTabs.filter { it.id != id }
        _tabs.value = newTabs
        if (_activeTabId.value == id) {
            _activeTabId.value = newTabs.last().id
            _currentUrl.value = newTabs.last().url
        }
    }
}

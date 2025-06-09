package com.recetario.ui

import android.content.Context
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.recetario.data.AppDatabase
import com.recetario.data.Recipe
import kotlinx.coroutines.launch
import java.io.BufferedReader
import java.io.InputStreamReader

@Composable
fun ImportExportScreen() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    var error by remember { mutableStateOf<String?>(null) }
    var success by remember { mutableStateOf<String?>(null) }

    val exportRecipes = {
        scope.launch {
            try {
                val db = AppDatabase.getDatabase(context)
                val recipes = db.recipeDao().getAll()
                val json = kotlinx.serialization.json.Json.encodeToString(
                    kotlinx.serialization.builtins.ListSerializer(Recipe.serializer()),
                    recipes
                )
                // Aquí se debería implementar la lógica para guardar el archivo JSON
                success = "Exportación exitosa (funcionalidad pendiente)"
                error = null
            } catch (e: Exception) {
                error = "Error al exportar recetas"
                success = null
            }
        }
    }

    val importLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent(),
        onResult = { uri: Uri? ->
            if (uri == null) return@rememberLauncherForActivityResult
            scope.launch {
                try {
                    val inputStream = context.contentResolver.openInputStream(uri)
                    val reader = BufferedReader(InputStreamReader(inputStream))
                    val content = reader.readText()
                    reader.close()
                    inputStream?.close()
                    val recipes = kotlinx.serialization.json.Json.decodeFromString(
                        kotlinx.serialization.builtins.ListSerializer(Recipe.serializer()),
                        content
                    )
                    val db = AppDatabase.getDatabase(context)
                    recipes.forEach { db.recipeDao().insert(it) }
                    success = "Importación exitosa"
                    error = null
                } catch (e: Exception) {
                    error = "Error al importar recetas"
                    success = null
                }
            }
        }
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        if (error != null) {
            Text(text = error!!, color = MaterialTheme.colorScheme.error)
        }
        if (success != null) {
            Text(text = success!!, color = MaterialTheme.colorScheme.primary)
        }
        Button(onClick = exportRecipes, modifier = Modifier.fillMaxWidth()) {
            Text("Exportar Recetas")
        }
        Button(
            onClick = { importLauncher.launch("application/json") },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Importar Recetas")
        }
    }
}

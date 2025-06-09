import os
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Ruta al archivo de credenciales JSON de Google Cloud
SERVICE_ACCOUNT_FILE = 'credentials.json'

# ID de la carpeta en Google Drive donde se subirá el archivo
FOLDER_ID = 'your_folder_id_here'

# Archivo a subir
FILE_PATH = 'recetario-android-app.zip'
FILE_NAME = 'recetario-android-app.zip'

def upload_file_to_drive():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=['https://www.googleapis.com/auth/drive.file']
    )
    service = build('drive', 'v3', credentials=credentials)

    file_metadata = {
        'name': FILE_NAME,
        'parents': [FOLDER_ID]
    }
    media = MediaFileUpload(FILE_PATH, mimetype='application/zip')
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f'Archivo subido con ID: {file.get("id")}')

if __name__ == '__main__':
    upload_file_to_drive()

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Asegúrate de que estas URLs coincidan con tus endpoints de Django
  private apiUrl = 'http://localhost:8000/api/usuarios/'; // URL base para usuarios
  private rolesApiUrl = 'http://localhost:8000/api/roles/'; // URL para obtener los roles

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los usuarios.
   */
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id El ID del usuario.
   */
  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  /**
   * Crea un nuevo usuario.
   * @param usuario El objeto usuario con los datos a enviar.
   */
  createUsuario(usuario: any): Observable<any> {
    // PREPARACIÓN DE LOS DATOS PARA EL BACKEND:
    // El frontend usa 'rol_id' en su ngModel.
    // El backend espera el ID del rol en un campo llamado 'rol'.
    // Creamos un nuevo objeto para enviar, mapeando 'rol_id' a 'rol'.
    const dataToSend = {
      username: usuario.username,
      email: usuario.email,
      password: usuario.password,
      telefono: usuario.telefono,
      rol_id: usuario.rol_id // <--- ¡ESTO ES CLAVE! Mapea rol_id del front a 'rol' para el back
    };

    console.log("DEBUG: Datos finales enviados a la API de creación de usuario:", dataToSend);
    return this.http.post<any>(this.apiUrl, dataToSend);
  }

  /**
   * Actualiza el rol de un usuario existente.
   * @param id El ID del usuario a actualizar.
   * @param rolId El nuevo ID del rol.
   */
  updateUsuario(id: number, rolId: number): Observable<any> {
    // Para la actualización, solo enviamos el campo 'rol' con su ID
    return this.http.patch<any>(`${this.apiUrl}${id}/`, { rol: rolId });
  }

  /**
   * Obtiene la lista de todos los roles disponibles.
   */
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesApiUrl);
  }
}

import { AxiosError } from "axios";

/**
 * Extrae el mensaje de error de una respuesta de Axios
 * @param error - Error capturado en el catch
 * @param defaultMessage - Mensaje por defecto si no se puede extraer uno específico
 * @returns Mensaje de error legible para el usuario
 */
export const getErrorMessage = (error: unknown, defaultMessage: string = "Ha ocurrido un error"): string => {
  if (error instanceof AxiosError) {
    // Intentar obtener el mensaje del backend
    const backendMessage = error.response?.data?.message;
    
    if (backendMessage) {
      // Si es un array de mensajes (validación), unirlos
      if (Array.isArray(backendMessage)) {
        return backendMessage.join(", ");
      }
      return backendMessage;
    }
    
    // Mensajes por código de estado HTTP
    switch (error.response?.status) {
      case 400:
        return "Solicitud inválida. Verifica los datos ingresados.";
      case 401:
        return "No autorizado. Por favor, inicia sesión nuevamente.";
      case 403:
        return "No tienes permisos para realizar esta acción.";
      case 404:
        return "Recurso no encontrado.";
      case 409:
        return "Conflicto. El recurso ya existe.";
      case 500:
        return "Error del servidor. Intenta nuevamente más tarde.";
      default:
        return defaultMessage;
    }
  }
  
  // Si no es un error de Axios, devolver el mensaje por defecto
  return defaultMessage;
};

/**
 * Traduce mensajes comunes del backend al español
 */
export const translateErrorMessage = (message: string): string => {
  const translations: Record<string, string> = {
    "Patient profile not found": "Perfil de paciente no encontrado. El paciente seleccionado no tiene un perfil creado.",
    "Therapist profile not found": "Perfil de terapeuta no encontrado. El terapeuta seleccionado no tiene un perfil creado.",
    "Session not available": "Ya existe una sesión en ese horario. Por favor, selecciona otro horario.",
    "Therapist not found": "Terapeuta no encontrado.",
    "Patient not found": "Paciente no encontrado.",
    "Invalid credentials": "Credenciales inválidas.",
    "Token is missing": "Token de autenticación faltante.",
    "Invalid or expired token": "Token inválido o expirado. Por favor, inicia sesión nuevamente.",
    "La fecha de inicio no puede ser de un día que ya pasó": "La fecha de inicio no puede ser de un día que ya pasó.",
    "La fecha de fin no puede ser anterior a la fecha de inicio": "La fecha de fin debe ser posterior a la fecha de inicio.",
  };
  
  return translations[message] || message;
};

/**
 * Obtiene y traduce el mensaje de error
 */
export const getTranslatedErrorMessage = (error: unknown, defaultMessage: string = "Ha ocurrido un error"): string => {
  const message = getErrorMessage(error, defaultMessage);
  return translateErrorMessage(message);
};

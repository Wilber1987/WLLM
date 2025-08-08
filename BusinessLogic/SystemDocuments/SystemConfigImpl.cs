using Microsoft.Extensions.Configuration;
using DataBaseModel;
using BusinessLogic.SystemConfig;

namespace CAPA_NEGOCIO.SystemConfig
{
	public class SystemConfigImpl : APPCORE.SystemConfig.SystemConfig
	{
		public SystemConfigImpl()
		{
			configuraciones = new Transactional_Configuraciones().Get<Transactional_Configuraciones>();
			TITULO = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.TITULO.ToString()))?.Valor ?? TITULO;
			SUB_TITULO = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.SUB_TITULO.ToString()))?.Valor ?? SUB_TITULO;
			NOMBRE_EMPRESA = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.NOMBRE_EMPRESA.ToString()))?.Valor ?? NOMBRE_EMPRESA;
			LOGO_PRINCIPAL = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO_PRINCIPAL.ToString()))?.Valor ?? LOGO_PRINCIPAL;
			MEDIA_IMG_PATH = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.MEDIA_IMG_PATH.ToString()))?.Valor ?? MEDIA_IMG_PATH;
			VERSION = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.VERSION.ToString()))?.Valor ?? VERSION;
			MEMBRETE_HEADER = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.MEMBRETE_HEADER.ToString()))?.Valor ?? MEMBRETE_HEADER;
			MEMBRETE_FOOTHER = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.MEMBRETE_FOOTHER.ToString()))?.Valor ?? MEMBRETE_FOOTHER;
			MEDIA_ATTACH_PATH = configuraciones.Find(c => c.Nombre != null &&
				c.Nombre.Equals(ConfiguracionesThemeEnum.MEDIA_ATTACH_PATH.ToString()))?.Valor ?? MEDIA_ATTACH_PATH;

		}
		public new List<Transactional_Configuraciones> configuraciones = [];

		public static bool IsAutomaticCaseActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			//TODO IMPLEMENTAR ESTE METODO
			return true;
		}
		public static bool IsNotificationsActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			//TODO IMPLEMENTAR ESTE METODO
			return true;
		}
		public static bool IsMessagesActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			//TODO IMPLEMENTAR ESTE METODO
			return false;
		}
		public static bool IsWhatsAppActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			//TODO IMPLEMENTAR ESTE METODO
			return true;
		}
		public static bool IsQuestionnairesActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			//TODO IMPLEMENTAR ESTE METODO
			return false;
		}

		public static bool IsAutomaticVinculateCaseActive()
		{
			if (IsDevelopment)
			{
				return IsDevelopment;
			}
			return true;
		}

		public static string GetMediaAttachPath()
		{
			string? path = new Transactional_Configuraciones().GetParam(ConfiguracionesThemeEnum.MEDIA_ATTACH_PATH, "")?.Valor;

			if (string.IsNullOrEmpty(path))
				return "";

			// Eliminar barras iniciales y finales
			path = path.Trim('/');

			// Añadir barra final
			return $"{path}/";
		}

		internal static string GetMediaImagePath()
		{
			string? path = new Transactional_Configuraciones().GetParam(ConfiguracionesThemeEnum.MEDIA_IMG_PATH, "")?.Valor;

			if (string.IsNullOrEmpty(path))
				return "";

			// Eliminar barras iniciales y finales
			path = path.Trim('/');

			// Añadir barra final
			return $"{path}/";
		}
	}

}

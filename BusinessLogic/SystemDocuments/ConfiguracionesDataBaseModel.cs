using API.Controllers;
using APPCORE;
namespace BusinessLogic.SystemConfig
{
	public class Transactional_Configuraciones : APPCORE.SystemConfig.Transactional_Configuraciones
	{
		public  Transactional_Configuraciones? GetParam(ConfiguracionesThemeEnum prop, string defaultValor = "", ConfiguracionesTypeEnum TYPE = ConfiguracionesTypeEnum.THEME)
		{
			Nombre = prop.ToString();

			var find = Find<Transactional_Configuraciones>();
			if (find == null)
			{
				
				Valor = defaultValor;
				Descripcion = prop.ToString();
				Nombre = prop.ToString();
				Tipo_Configuracion = TYPE.ToString();				
				find = (Transactional_Configuraciones?)Save();
			}
			return find;
		}
		public List<Transactional_Configuraciones> GetLogicTheme()
		{
			return Get<Transactional_Configuraciones>()
				.Where(x => x.Tipo_Configuracion!.Equals(ConfiguracionesTypeEnum.THEME.ToString())).ToList();
		}
	}
	public enum ConfiguracionesTypeEnum
	{
		THEME, GENERAL_DATA, NUMBER, SELECT,
        IMAGE
    }
	public enum ConfiguracionesThemeEnum
	{
		TITULO, SUB_TITULO, NOMBRE_EMPRESA, LOGO_PRINCIPAL, LOGO, MEDIA_IMG_PATH,
		VERSION, PARAM_NUMBER_TEMPLATE, MESSAGE_TEMPLATE, AUTOMATIC_SENDER_REPORT,
        DESTINATARIOS_AUTOMATIC_SENDER_REPORT,
        MEMBRETE_HEADER,
        MEMBRETE_FOOTHER,
        DOMAIN_URL,
        //ESTAS SE ESTAN USANDO PARA PLANTILLAS DE MENSAJES DE META API
        TEMPLATE_NAME,
        TEMPLATE_IMAGE_HEADER,
        BLACK_LIST,
        MEDIA_ATTACH_PATH
    }	
}

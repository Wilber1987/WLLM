using APPCORE;
using APPCORE.Security;
using API.Controllers;
using APPCORE.Services;

namespace CAPA_NEGOCIO.MAPEO;

public class Cat_Dependencias : EntityClass
{
	[PrimaryKey(Identity = true)]
	public int? Id_Dependencia { get; set; }
	public string? Descripcion { get; set; }
	public string? Username { get; set; }
	public string? Password { get; set; }
	public string? Host { get; set; }
	public int? Id_Dependencia_Padre { get; set; }
	public int? Id_Institucion { get; set; }
	public string? AutenticationType { get; set; }
	public string? HostService { get; set; }
	//AUTH 2.0
	public string? TENAT { get; set; }
	public string? CLIENT { get; set; }
	public string? OBJECTID { get; set; }
	public string? CLIENT_SECRET { get; set; }
	public string? SMTPHOST { get; set; }
	public bool? DefaultDependency { get; set; }


	[ManyToOne(TableName = "Cat_Dependencias", KeyColumn = "Id_Dependencia", ForeignKeyColumn = "Id_Dependencia_Padre")]
	public Cat_Dependencias? Cat_Dependencia { get; set; }
	[OneToMany(TableName = "Cat_Dependencias", KeyColumn = "Id_Dependencia", ForeignKeyColumn = "Id_Dependencia_Padre")]
	public List<Cat_Dependencias>? Cat_Dependencias_Hijas { get; set; }
		public List<Cat_Dependencias> GetDependencias<T>()
	{
		return Get<Cat_Dependencias>().Select(m =>
		{
			m.Password = "PROTECTED";
			return m;
		}).ToList();
	}

	
}
public enum DefaultDependencys
{
	DEFAULT,
	CONSULTAS_SEGUIMIENTOS,
	DEPARTAMENTO_DE_QUEJAS

}
public enum DefaultServices_Default
{
	ASISTENCIA_GENERAL,
	CONSULTA_DE_HORARIOS,
	CONSULTA_DE_CONTACTO,
	CONSULTA_SOBRE_EVENTOS,
	SOLICITUD_DE_ASISTENCIA
}
public enum DefaultServices_DptConsultasSeguimientos
{
	RASTREO_Y_SEGUIMIENTOS,
	INFORMACION_ENTREGAS_SEGUIMIENTOS,
	INFORMACION_SOBRE_DOCUMENTOS
}
public enum DefaultServices_DptQuejas
{
	QUEJAS_POR_RETRASOS,
	QUEJAS_POR_IMPORTES,
	QUEJAS_POR_ESTAFA,
	QUEJAS_GENERALES
}

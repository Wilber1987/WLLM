using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using APPCORE;
using APPCORE.Security;
using APPCORE.Services;
using CAPA_NEGOCIO.SystemConfig;

namespace CAPA_NEGOCIO.MAPEO
{
	public class Tbl_Profile : APPCORE.Security.Tbl_Profile
	{
		public static Tbl_Profile? GetUserProfile(string identity)
		{
			return new Tbl_Profile() { IdUser = AuthNetCore.User(identity).UserId }.Find<Tbl_Profile>();
		}
		public int? Id_Pais_Origen { get; set; }
		public int? Id_Institucion { get; set; }
		public string? Indice_H { get; set; }

		public string? ORCID { get; set; }
		//[ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "IdUser")]
		public Security_Users? Security_Users { get; set; }
		//[ManyToOne(TableName = "Cat_Paises", KeyColumn = "Id_Pais", ForeignKeyColumn = "Id_Pais_Origen")]
		public Cat_Paises? Cat_Paises { get; set; }
		
		public List<Cat_Dependencias?>? Cat_Dependencias { get; set; }

		
		public Object? TakeProfile()
		{
			try
			{
				return this.Find<Tbl_Profile>();
			}
			catch (Exception)
			{

				throw;
			}
		}
		public Object Postularse()
		{
			try
			{
				this.Estado = "POSTULANTE";
				SaveProfile();
				return true;
			}
			catch (Exception) { return false; }

		}
		public Object SaveProfile()
		{
			try
			{
				BeginGlobalTransaction();
				if (Foto != null)
				{
					ModelFiles? pic = (ModelFiles?)FileService.upload(SystemConfigImpl.GetMediaImagePath(), new ModelFiles
					{
						Value = Foto,
						Type = "png",
						Name = "profile"
					}).body;
					Foto = pic?.Value?.Replace("wwwroot", "");

				}
				if (this.Id_Perfil == null)
				{
					this.Save();
				}
				else
				{
					Correo_institucional = null;
					IdUser = null;
					
					this.Update();
				}
			
				CommitGlobalTransaction();
				return this;

			}
			catch (System.Exception)
			{
				RollBackGlobalTransaction();
				throw;
			}


		}
		public Object AdmitirPostulante()
		{
			try
			{
				// new Security_Users()
				// {
				//     Mail = this.Correo_institucional,
				//     Nombres = this.Nombres + " " + this.Apellidos,
				//     Estado = "Activo",
				//     Descripcion = "Investigador postulado",
				//     Password = Guid.NewGuid().ToString(),
				//     Token = Guid.NewGuid().ToString(),
				//     Token_Date = DateTime.Now,
				//     Token_Expiration_Date = DateTime.Now.AddMonths(6),
				//     Security_Users_Roles = new List<Security_Users_Roles>(){
				//         new Security_Users_Roles() { Id_Role = 2 }
				//     }
				// }.SaveUser();
				// this.Estado = "ACTIVO";
				// this.Update("Id_Perfil");
				//MailServices.SendMail(this.Correo_institucional);
				return true;
			}
			catch (Exception) { return false; }
		}

		public List<Tbl_Profile> GetProfiles(string? identity)
		{
			List<Tbl_Profile> profiles = new List<Tbl_Profile>();
			if (AuthNetCore.HavePermission(Permissions.ADMIN_ACCESS.ToString(), identity))
			{
				profiles.AddRange(Where<Tbl_Profile>(FilterData.NotNull("IdUser")));
			}
			else if (AuthNetCore.HavePermission(Permissions.PERFIL_MANAGER.ToString(), identity))
			{
				UserModel user = AuthNetCore.User(identity);
				Tbl_Profile? userProfile = new Tbl_Profile { IdUser = user.UserId }.Find<Tbl_Profile>();
				
			}
			else
			{
				
			}

			foreach (var profile in profiles)
			{
				
			}
			return profiles;
		}


		public static Tbl_Profile Get_Profile(UserModel User)
		{
			return Get_Profile(User.UserId.GetValueOrDefault());
		}

		public static Tbl_Profile Get_Profile(int UserId)
		{
			Tbl_Profile? tbl_Profile = new Tbl_Profile { IdUser = UserId }.Find<Tbl_Profile>();		
			return tbl_Profile ?? new Tbl_Profile { IdUser = UserId };
		}

	}	
}
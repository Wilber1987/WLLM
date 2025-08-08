using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using CAPA_NEGOCIO.SystemConfig;
using DataBaseModel;

namespace BusinessLogic.Security
{
    public class AuthNetCoreImp: AuthNetCore
    {
        public static UserModel RecoveryPassword(string? mail) 
        {
        	return RecoveryPassword(mail, SystemConfigImpl.GetSMTPDefaultConfig());
        }
    }
}
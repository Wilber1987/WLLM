using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CAPA_NEGOCIO.SystemConfig;

namespace DataBaseModel
{
   public class Config
	{
		public static SystemConfigImpl SystemConfig()
		{
			return new SystemConfigImpl();
		}
	}

}
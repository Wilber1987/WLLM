using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using APPCORE;
using APPCORE.Security;
using CAPA_NEGOCIO.Gestion_Mensajeria;
using DataBaseModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using UI.ApiControllers;
using WLLM.Hubs.MensajeriaNotificaciones;

namespace UI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApiMessageManagerController : ControllerBase
    {

        private readonly IHubContext<ChatHub> _hubContext;

        public ApiMessageManagerController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }
        [HttpPost]
        [AuthController(Permissions.SEND_MESSAGE)]
        public List<Contacto> getContacto(Contacto Inst)
        {
            return new Conversacion().GetContactos(HttpContext.Session.GetString("sessionKey"), Inst);
        }
        //Mensajes
        [HttpPost]
        [AuthController(Permissions.SEND_MESSAGE)]
        public List<Mensajes> getMensajes(Conversacion Inst)
        {
            return new Mensajes().GetMessage(HttpContext.Session.GetString("sessionKey"), Inst);
        }
        //Mensajes
        [HttpPost]
        [AuthController(Permissions.SEND_MESSAGE)]
        public ResponseService saveMensajes(Mensajes Inst)
        {
            var sessionKey = HttpContext.Session.GetString("sessionKey");

            // Guardar el mensaje (tu lógica actual)
            var response = Inst.SaveMessage(sessionKey);

            if (response.status == 200)
            {
                new WSocketSignalService(_hubContext).SendMessageSignal(Inst);
            }
            return response;
        }


        [HttpPost]
        [AuthController(Permissions.SEND_MESSAGE)]
        public Conversacion? findConversacion(Conversacion Inst)
        {
            return Inst.FindConversacion(HttpContext.Session.GetString("sessionKey"));
        }
        [HttpPost]
        [AuthController(Permissions.SEND_MESSAGE)]
        public List<Conversacion> getConversacion(Contacto Inst)
        {
            return Conversacion.GetConversaciones(HttpContext.Session.GetString("sessionKey"), Inst);
        }
    }
}
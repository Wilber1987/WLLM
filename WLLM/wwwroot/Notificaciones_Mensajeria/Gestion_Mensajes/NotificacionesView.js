//@ts-check
import { StylesControlsV2 } from "../../WDevCore/StyleModules/WStyleComponents.js";
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ComponentsManager, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Notificaciones_ModelComponent } from "../Model/ModelComponent/Notificacion_ModelComponent.js";
import { Notificaciones } from "../Model/Notificaciones.js";
class NotificacionesView extends HTMLElement {
	constructor() {
		super();
		this.TabContainer = WRender.createElement({ type: 'div', props: { class: "content-container", id: "TabContainer" } });
		this.DOMManager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: true });
		this.NotificationsNav = new WAppNavigator({
			NavStyle: "tab",
			Inicialize: true,
			Elements: this.NavElements()
		})
		this.append(
			this.Style,
			StylesControlsV2.cloneNode(true),
			this.NotificationsNav,
			html`<h3>Panel de notificaciones.</h3>`,
			this.TabContainer
		);
	}
	NavElements() {
		return [
			{
				name: "Notificaciones", url: "#",
				action: async (ev) => {
					return new NotificacionesElements({ DOMManager: this.DOMManager });
				}
			}
		];
	}

	connectedCallback() { }
	Style = css`
		w-notificaciones-view{
			display: grid;
			grid-template-columns: 300px calc(100% - 320px);
			gap: 0px  20px;  
			& .content-container{
				min-height: 600px;
			}
			& h3 {
				justify-self: left;
				width:100%;
			}
		}
		w-app-navigator {
			display: block;
			max-height: calc(100vh - 220px);
			overflow-y: auto;
			grid-row: span 2;
		}
		
		@media (max-width: 1200px) {
			w-notificaciones-view{
				display: grid;
				grid-template-columns: 300px calc(100% - 320px);
			}
		}

		@media (max-width: 800px) {
			w-notificaciones-view{
				display: grid;
				grid-template-columns: 100%;
			}
		}
	`
}
customElements.define('w-notificaciones-view', NotificacionesView);
export { NotificacionesView };



class NotificacionesReader extends HTMLElement {
	/**
	 * @param {{ Leidas?: boolean }} Config
	 */
	constructor(Config) {
		super();
		this.Config = Config;
		this.NotificacionesElements = new NotificacionesElements({ Leidas: this.Config?.Leidas });
		this.append(
			this.Style,
			StylesControlsV2.cloneNode(true)
		);
	}
	connectedCallback() {
		setTimeout(() => {
			this.NotificacionesElements.Notificaciones
				.filter(notificacion => notificacion.Leido == false)
				.forEach((notificacion, index) => {
					if (index == 0) {
						this.NotificacionesElements.VerDetalle(notificacion)
					}
				})
		}, 1000);

	}
	Style = css``
}
customElements.define('w-notificaciones-reader', NotificacionesReader);
export { NotificacionesReader };

class NotificacionesElements extends HTMLElement {
	/**
	 * @param {{ 
	 * DOMManager?: ComponentsManager;
	 * Leidas?: boolean;
	 *  }} [Config]
	 */
	constructor(Config) {
		super();
		this.Config = Config;
		this.append(
			this.Style,
			StylesControlsV2.cloneNode(true),
			this.StyleNotifications,
		);
		/**@type {Array<Notificaciones>} */
		this.Notificaciones = [];
		this.NavElements();
	}
	async NavElements() {
		// @ts-ignore
		this.Notificaciones = await new Notificaciones_ModelComponent({
			Leido: this.Config?.Leidas
		}).Get();
		// @ts-ignore
		const Notifications = this.Notificaciones.sort((a, b) => a.Leido - b.Leido).map(Notificacion => {
			return {
				Object: Notificacion,
				Titulo: Notificacion.Titulo ?? `Notificación de ${Notificacion.Tipo}`,
				Descripcion: Notificacion.Mensaje,
				Fecha: Notificacion.Fecha,
				Leido: Notificacion.Leido,
				Action: async () => this.VerDetalle(Notificacion)
			};
		});
		this.append(this.DrawNotificaciones(Notifications));
	}

	connectedCallback() { }

	DrawNotificaciones = (Dataset = []) => {
		return WRender.Create({
			className: "GroupDiv", children: Dataset.map(n => {
				return this.CreateNotificacion(n)
			})
		})
	}
	CreateNotificacion = (Notificacion) => {
		const NotificacionContainer = this.BuildNotificationCard(Notificacion)
		/*NotificacionContainer.appendChild(WRender.Create({
			className: "options", children: Notificacion.Actions.map(a => ({
				tagName: 'input', type: 'button', className: a.class, value: a.TextAction, onclick: async () => {
					await a.Action(Notificacion.Object)
				}
			}))
		}))*/
		return NotificacionContainer;
	}

	BuildNotificationCard(Notificacion) {
		return WRender.Create({
			className: "NotificationContainer " + (Notificacion.Leido == true ? "Leido" : "NoLeido"), children: [
				{ tagName: 'label', className: "titulo", innerText: Notificacion.Titulo },
				{ tagName: 'label', className: "fecha", innerText: Notificacion.Fecha?.toDateFormatEs() ?? "" }
			], onclick: Notificacion.Action
		});
	}
	BuildNotificationDetail(Notificacion) {
		return WRender.Create({
			className: "NotificationContainer " + (Notificacion.Leido == true ? "Leido" : "NoLeido"), children: [
				{ tagName: 'label', className: "titulo", innerText: Notificacion.Titulo },
				{ tagName: 'label', className: "fecha", innerText: Notificacion.Fecha?.toDateFormatEs() ?? "" },
				{ tagName: 'div', innerHTML: Notificacion.Descripcion }
			]
		});
	}

	VerDetalle(Notificacion) {
		try {
			const attachs = WRender.Create({ className: "attachs", style: "text-align: center" });
			Notificacion.Media?.forEach(attach => {
				if (attach.Type.toUpperCase().includes("JPG") || attach.Type.toUpperCase().includes("JPEG") || attach.Type.toUpperCase().includes("PNG")) {
					attachs.append(WRender.Create({
						tagName: "img", src: attach.Value.replace("wwwroot", ""), style: {
							width: "auto",
							objectFit: "cover",
							height: "calc(100% - 20px)",
							maxWidth: "100%",
							overflow: "hidden",
							borderRadius: "20px"
						}
					}));
				} else if (attach.Type.toUpperCase().includes("PDF")) {
					attachs.append(WRender.Create({
						tagName: "iframe", src: attach.Value.replace("wwwroot", ""), style: {
							height: "-webkit-fill-available",
							width: "100%",
							minHeight: "500px"
						}
					}));
				}
			});
			const notificacionContainer = html`<div class="notification-viewer">
				${this.StyleNotifications.cloneNode(true)}
				${this.BuildNotificationDetail({
				TextAction: Notificacion.Estado,
				Object: Notificacion,
				Titulo: Notificacion.Titulo ?? `Notificación de ${Notificacion.Tipo}`,
				Descripcion: Notificacion.Mensaje,
				Fecha: Notificacion.Fecha,
				Leido: Notificacion.Leido
			})}
				${attachs}
			</div>`;
			if (this.Config?.DOMManager) {
				this.Config.DOMManager.NavigateFunction("notif" + Notificacion.Id, notificacionContainer);
				return;
			}
			document.body.appendChild(html`<div class="NotificationMiniCard" id="notif${Notificacion.Id}">
			<button class="close" onclick="document.getElementById('notif${Notificacion.Id}').remove()">X</button>
				${notificacionContainer}
			</div>`);
		} catch (error) {
			console.log(error);
		} finally {
			new Notificaciones({ Id: Notificacion.Id }).MarcarComoLeido();
		}

	}
	StyleNotifications = css`
		.NotificationMiniCard {
			position: absolute;
			bottom: 10px;
			right: 10px;            
			width: 300px;
			height: 300px;
			overflow-y: auto;
			overflow-x: hidden;
			border-radius: 10px;
			box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);
			background-color: var(--secundary-color);
			display: flex;
			justify-content: center;
			transition: all 0.5s;
			padding: 15px;
			animation: notify 0.5s;

		}

		@keyframes notify {
			0% {    
				opacity: 0;
				transform: translateX(100%);
			}
			100% {
				opacity: 1;    
				transform: translateX(0%);
			}
		}
		.NotificationContainer {
			padding: 10px;
			border-radius: 0.3cm;
			display: flex;
			flex-direction: column;
			box-shadow: 0 0 3px 0 var(--fifty-color);
			background-color: var(--secundary-color);
			margin: 10px; 
			color: var(--font-fourth-color);  
			cursor: pointer;
			& * {
				cursor: pointer;	
			}
		}        
		.NotificationMiniCard .close{
			position: absolute;
			top: 10px;
			right: 10px;
			font-size: 20px;
			color: var(--font-secundary-color);
			cursor: pointer;
			border: none;
			background-color: transparent;
		}
		
		.titulo{
			font-size: 14px;
			font-weight: 500;
			color: var(--font-secundary-color);   
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		}
		
		.fecha{
			padding: 10px 0px;
			font-size: 12px;
		}
		.NotificationContainer p{
			padding: 10px 0px;
			margin: 0px;
			border-bottom: 1px solid var(--fourth-color);
			font-size: 14px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			height: 20px;
		} 
		.notification-viewer {
			width: 100%;
			& .NotificationContainer {
				padding: 0px;
				box-shadow: unset;
				& .fecha{
					border-bottom: unset;
					font-size: 11px;	
					text-align: right;
				}
				& p {
					white-space: unset;
					text-overflow: unset;
					overflow: unset;
					height: auto;
				}
			}
			& .Leido 
			{
				background-color: unset;
			}
			& .titulo {
				font-size: 16px;
				text-align: left;
				border-bottom: 1px #1c4786 solid;
				padding: 0 0 10px 0;
				text-transform: uppercase;
			}
		}
		.NotificationContainer .options{
			display: flex;
			justify-content: flex-end;
			margin-top: 10px;
		} 
		.options {
			display: flex;
			justify-content: flex-end;
		}
		.Leido {
			background-color: var(--secundary-color);
		}
		.NoLeido {
			position: relative;
		}
		.NoLeido::after {
			display: block;
			content: " ";
			width: 30px;
			height: 10px;
			position: absolute;
			background-color: rgb(40, 183, 101);
			border-radius: 5px;
			top: 20px;
			right: 20px;
		}
		.BtnMini {
			background-color: #1c4786;
			border: none;
			outline: none;
			border-radius: 8px;
			color: #fff;
			font-weight: 600;
			margin: 0px;
			margin-right: 5px;
			cursor: pointer;
			transition: 0.5s;
			font-size: 12px;
			padding: 8px;
			width: 200px;
		}
		.ContainerFormWModal {
			display: grid;
			grid-template-rows: 10px calc(100% - 10px);           
		}
	`
	Style = css`
		
	`
	GetDescription(E) {
		return `${E.Tbl_Evento?.Tbl_InvestigatorProfile?.Nombres} ${E.Tbl_Evento?.Tbl_InvestigatorProfile?.Apellidos} Indico que participarias en el evento ${E.Tbl_Evento?.Nombre} que se realizara de forma ${E.Tbl_Evento?.Modalidad}, con el rol de ${E.Cat_Tipo_Participacion_Eventos?.Descripcion} de ${E.Titulo} el ${E.Fecha_Participacion?.toDateFormatEs()}.
		
		¿Desea confirmar su participación?`;
	}

}
customElements.define('w-notificaciones-elements', NotificacionesElements);
export { NotificacionesElements };

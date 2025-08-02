//@ts-check

import { NotificationRequest_ModelComponent, NotificationTypeEnum } from "../Model/ModelComponent/NotificacionRequest_ModelComponent.js";

import { NotificationRequest } from "../Model/NotificationRequest.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../../WDevCore/StyleModules/WStyleComponents.js";
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";

import { WModalForm } from "../../WDevCore/WComponents/WModalForm.js";
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
import { html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import "../../WDevCore/libs/html2pdf.js"
import "../../WDevCore/libs/xlsx.full.min.js"
import { Notificaciones_ModelComponent } from "../Model/ModelComponent/Notificacion_ModelComponent.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Historial_NotificationsView } from "./Historial_NotificationsView.mjs";
import { ModalMessage } from "../../WDevCore/WComponents/ModalMessage.js";
import { ModalVericateAction } from "../../WDevCore/WComponents/ModalVericateAction.js";
import { BuildReportMessage } from "./ReporteMessageBuilder.js";
import { Tbl_Profile } from "../../Gestion_Perfil/FrontModel/Tbl_Profile.js";


/**
 * @typedef {Object} NotificacionesManagerViewConfig
 * * @property {Object} [propierty]
 */
class NotificacionesManagerView extends HTMLElement {
	/**
	 * @param {NotificacionesManagerViewConfig} props 
	 */
	constructor(props) {
		super();
		this.OptionContainer = WRender.Create({ className: "OptionContainer" });
		//this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
		this.append(this.CustomStyle);
		this.append(
			StylesControlsV2.cloneNode(true),
			StyleScrolls.cloneNode(true),
			StylesControlsV3.cloneNode(true),
			html`<h2>GESTIÓN DE NOTIFICACIONES</h2>`,
			//this.OptionContainer
		);
		this.Draw();
		this.NotificationType = NotificationTypeEnum.CLASE
	}
	Draw = async () => {
		this.SetOption();
	}


	async SetOption() {
		const btn = WRender.Create({
			tagName: 'button', className: 'btn-success', innerText: 'GUARDAR NOTIFICACIONES',
			onclick: async () => this.ProcessRequest()
		});
		/*this.OptionContainer.append()*/
		this.Navigator = new WAppNavigator({
			DarkMode: false,
			//Direction: "row",
			NavStyle: "tab",
			Inicialize: true,
			Elements: [
				{
					name: "Usuarios", action: () => {
						return WRender.Create({
							children: [WRender.Create({
								tagName: 'button', className: 'btn-success', innerText: 'ENVIAR NUEVA NOTIFICACION',
								onclick: async () => this.ProcessRequest()
							}), this.UsuariosComponent()]
						});
					}
				},  {
					name: "Notificaciones enviadas", action: () => {
						return WRender.Create({ children: [this.SendsNotificationsComponent()] });
					}
				}, {
					name: "Informe", action: () => {
						return new Historial_NotificationsView();
					}
				}
			]
		});
		this.Navigator.className = "content-container"
		this.append(this.Navigator);
	}
	NotificationsComponent() {
		this.NotificationType = NotificationTypeEnum.LIBRE;
		if (!this.FreeNotificationComponent) {
			const NotificationTable = new WTableComponent({
				ModelObject: new NotificactionDestinatarios_ModelComponent(),
				paginate: false,
				maxElementByPage: 200,
				Options: {
					Delete: true,
					Edit: true,
				}
			});
			this.NotificationTable = NotificationTable;
			const AlinkDescarga = WRender.Create({
				// @ts-ignore dowload
				tagName: 'a', className: 'btn-success', download: "INVITACIONES_FORMAT",
				innerText: 'Descargar Formato', href: "/INVITACIONES_FORMAT.xlsx"
			})
			let Notificaciones = [];
			const btn = WRender.Create({
				tagName: 'button', className: 'btn-success', innerText: 'GUARDAR NOTIFICACIONES',
				onclick: async () => this.ProcessRequest()
			});
			const btnImportData = html`<input type="file"  class="btn-success" accept=".xls,.xlsx"
				onchange="${async (ev) => {
					const reader = new FileReader();
					reader.onload = (e) => {
						var data = e?.target?.result;
						// @ts-ignore
						var workbook = XLSX.read(data, {
							type: 'binary'
						});
						workbook.SheetNames.forEach(function (sheetName) {
							// @ts-ignore
							var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
							let fail = false
							const invitaciones = XL_row_object.filter((i) => {
								const inv = BuildDestinatario(i);
								console.log(inv);

								if (inv.Telefono != undefined || !inv.Correo) return inv;
								else fail = true;
							})
							NotificationTable.Dataset = invitaciones.map(i => BuildDestinatario(i));
							NotificationTable.DrawTable();
							if (fail) document.body.append(ModalMessage("Error al cargar registros",
								"Algunos registros no contenían el formato correcto y no han sido cargados como deberían"))
						})
					};
					reader.onerror = function (ex) {
						console.log(ex);
					};
					reader.readAsBinaryString(ev.target.files[0]);
				}}" value="Importar Datos" />`

			this.FreeNotificationComponent = html`<div>
				<div class="OptionsContainer">
					<style> 
						.OptionsContainer{
							display: flex;
							justify-content: justify;
							gap: 20px;
							margin-bottom: 20px;
							& * {
								color: #fff;
							}
						}
					</style>  
					${btn}				  
					${btnImportData}
				</div>
				${NotificationTable}
			</div>`
		}
		return this.FreeNotificationComponent;

		function BuildDestinatario(i) {
			return {
				Telefono: i["N.º de teléfono"] ?? i["No. de teléfono"] ?? i["No. de Teléfono"],
				Correo: i["Correo"] ?? i["E-mail"],
				NotificationData: {
					Direccion: i["Dirección del destinatario"],
					Destinatario: i["Destinatario"] ?? "DESCONOCIDO..",
					Telefono: i["N.º de teléfono"] ?? i["No. de teléfono"] ?? i["No. de Teléfono"],
					Fecha: i["Fecha de ingreso"],
					Fecha_del_envio_de_notificacion: i["fecha del envió de notificación"] ?? i["Fecha del envió de notificación"] ?? "-",
					Departamento: i["Departamento"],
					Municipio: i["Municipio"],
					Agencia: i["Agencia"],
					Correlativo: i["Correlativo"],
					NumeroPaquete: i["N.º de paquete"] ?? i["No. de paquete"] ?? "DESCONOCIDO..",
					NumeroAduana: i["N.º de Aduana"] ?? i["No. de Aduana"] ?? "DESCONOCIDO..",
					Dpi: i["Dpi"] ?? i["DPI"] ?? i["dpi"] ?? "DESCONOCIDO..",
					Nit: i["nit"] ?? i["NIT"] ?? i["Nit"],
					//Nit: i["Correo"],
					Params: Object.keys(i).map(prop => {
						return { Type: "text", Name: prop.trim(), Value: i[prop].trim() }
					})
				}
			};
		}
	}
	SendsNotificationsComponent() {
		this.NotificationType = NotificationTypeEnum.LIBRE;
		if (!this.SendsFreeNotificationComponent) {
			const model = new Notificaciones_ModelComponent({
				// @ts-ignore
				Get: async () => {
					return await model.GetData("ApiNotificacionesManage/GetNotificaciones")
				}
			})
			const NotificationTable = new WTableComponent({
				// @ts-ignore
				ModelObject: model,
				Options: {
					MultiSelect: true,
					Edit: true,
					Filter: true,
					AutoSetDate: true,
					FilterDisplay: true,
					UserActions: [{
						name: "Reporte", action: (notificacion) => {
							this.append(BuildReportMessage(notificacion))
						}
					}]
				}
			});
			this.SendsNotificationTable = NotificationTable;
			const btnReenviar = html`<input type="button"  class="btn-success"
				onclick="${async (ev) => {
					const response = await new Notificaciones_ModelComponent().ReenvioNotificaciones(NotificationTable.selectedItems);
					document.body.append(ModalMessage(response.message, undefined, true));
				}}" value="Reenviar notificaciones" />`

			this.SendsFreeNotificationComponent = html`<div>
				<div class="OptionsContainer">
					<style> 
						.OptionsContainer{
							display: flex;
							justify-content: justify;
							gap: 20px;
							margin-bottom: 20px;
							& * {
								color: #fff;
							}
						}
					</style>                    
					${btnReenviar}
				</div>
				${NotificationTable}
			</div>`
		}
		return this.SendsFreeNotificationComponent;
	}
	/*static BuildDestinatario(i) {
		return {
			Telefono: i["N.º de teléfono"],
			Correo: i["Correo"],
			NotificationData: {
				Direccion: i["Dirección del destinatario"],
				Destinatario: i["Destinatario"] ?? "DESCONOCIDO..",
				Telefono: i["N.º de teléfono"],
				Fecha: i["Fecha de ingreso"],
				Departamento: i["Departamento"],
				Municipio: i["Municipio"],
				Agenda: i["Agencia"],
				Correlativo: i["Correlativo"],
				NumeroPaquete: i["N.º de paquete"] ?? "DESCONOCIDO..",
				Dpi: i["Dpi"] ?? "DESCONOCIDO..",
				Correo: i["Correo"]
			}
		};
	}*/

	UsuariosComponent() {
		this.NotificationType = NotificationTypeEnum.SECCION;
		if (!this.UsuarioComponent) {
			this.UsuarioComponent = new WTableComponent({
				ModelObject: new Tbl_Profile(),
				AutoSave: true,
				Options: {
					Filter: true,
					FilterDisplay: true,
					AutoSetDate: false,
					MultiSelect: true
				}
			})
		}
		return this.UsuarioComponent;
	}

	CustomStyle = css`
		w-app-navigator {
			padding: 20px;
		}
		.TabContainer{
		   margin-top: 20px;
		}
	`
	ProcessRequest = () => {
		if (this.NotificationType == NotificationTypeEnum.LIBRE) {
			const entity = new NotificationRequest();
			entity.Destinatarios = this.NotificationTable?.Dataset ?? [];
			entity.NotificationType = NotificationTypeEnum.LIBRE;
			document.body.appendChild(ModalVericateAction(async () => {
				const response = await new NotificationRequest(entity).Save();
				document.body.appendChild(ModalMessage(response.message, undefined, true));
				//modal.close();
			}, `¿Desea enviar la notificación?`));
			return;
		}
		const modal = new WModalForm({
			ModelObject: new NotificationRequest_ModelComponent(),
			title: "NUEVA NOTIFICACIÓN",
			StyleForm: "columnX1",
			ObjectOptions: {
				SaveFunction: async (/**@type {NotificationRequest} */ entity) => {
					let mensaje = ""
					console.log(this.NotificationType);

					if (this.NotificationType == NotificationTypeEnum.USUARIOS) {
						entity.NotificationType = NotificationTypeEnum.USUARIOS;
						// @ts-ignore
						entity.Usuarios = this.UsuarioComponent?.selectedItems.map(s => s.User_id);
						mensaje = entity.Usuarios.length == 0 ? "a todas los Usuarios" : "a los Usuarios selecionadas";

					} else if (this.NotificationType == NotificationTypeEnum.DEPENDENCIA) {
						entity.NotificationType = NotificationTypeEnum.DEPENDENCIA;
						// @ts-ignore
						entity.Dependencias = this.DependenciaComponent?.selectedItems.map(s => s.Id_Dependencia);
						mensaje = entity.Dependencias.length == 0 ? "a todas las dependencias" : "a las clases selecionadas";

					}
					document.body.appendChild(ModalVericateAction(async () => {
						const response = await new NotificationRequest(entity).Save();
						document.body.appendChild(ModalMessage(response.message, undefined, true));
						modal.close();
					}, `¿Desea enviar la notificación ${mensaje}?`));
				}
			}
		});
		document.body.append(modal);
	}
}

class NotificactionDestinatarios_ModelComponent {
	/**@type {ModelProperty} */ Correo = { type: "text" };
	/**@type {ModelProperty} */ Telefono = { type: "text" };
	/**@type {ModelProperty} */ NotificationData = {
		type: "MODEL",
		label: "Datos del destinatario", ModelObject: () => new NotificationData_ModelComponent()
	};
}
class NotificationData_ModelComponent {
	Departamento = { type: "text" };
	NumeroPaquete = { type: "text" };
	Direccion = { type: "text" };
	Destinatario = { type: "text" };
	Identificacion = { type: "text", hidden: true };
	Correlativo = { type: "text" };
	Fecha = { type: "text" };
	Fecha_del_envio_de_notificacion = { type: "text" };
	Municipio = { type: "text" };
	Agencia = { type: "text" };
	NumeroAduana = { type: "text" };
	Correo = { type: "text", hidden: true };
	Telefono = { type: "text", hidden: true };
	Dpi = { type: "text" };
	Nit = { type: "text" };
}
customElements.define('w-notificaciones-manager-view', NotificacionesManagerView);
export { NotificacionesManagerView }
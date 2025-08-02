//@ts-check
import { StylesControlsV2 } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WAppNavigator } from '../WDevCore/WComponents/WAppNavigator.js';
import { WDetailObject } from '../WDevCore/WComponents/WDetailObject.js';
import { WForm } from "../WDevCore/WComponents/WForm.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ComponentsManager, html, WRender } from '../WDevCore/WModules/WComponentsTools.js';
import { css } from '../WDevCore/WModules/WStyledRender.js';
import { ChangePasswordModel } from "../WDevCore/Security/SecurityModel.js";
import { WAjaxTools } from "../WDevCore/WModules/WAjaxTools.js";
import { Tbl_Profile } from "./FrontModel/Tbl_Profile.js";

const OnLoad = async () => {
    // @ts-ignore
    Main.append(WRender.Create({ tagName: "h3", innerText: "Administración de perfil" }));
    const AdminPerfil = new PerfilClass();
    // @ts-ignore
    Main.append(AdminPerfil.MainNav);
    // @ts-ignore
    Main.appendChild(AdminPerfil);

}
window.onload = OnLoad;
class PerfilClass extends HTMLElement {
    constructor() {
        super();
        //this.Id_Perfil = 1;
        this.id = "PerfilClass";
        this.className = "PerfilClass DivContainer";
        this.append(this.WStyle, StylesControlsV2.cloneNode(true));
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'content-container', id: "TabContainer" } });
        this.TabManager = new ComponentsManager({ MainContainer: this.TabContainer });
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabActividades = this.MainNav;
        this.DrawComponent();
    }
    EditarPerfilNav = () => {
        return [{
            name: "Perfil", action: async (ev) => { this.EditProfile(); }
        }];
    }
    MainNav = new WAppNavigator({
        //NavStyle: "tab",
        Direction: "row",
        Inicialize: true,
        Elements: [
            {
                name: "Datos Generales",
                action: async (ev) => {
                    this.response = await WAjaxTools.PostRequest("../../api/ApiProfile/TakeProfile");
                    this.TabManager.NavigateFunction("Tab-Generales",
                        new WDetailObject({ ObjectDetail: this.response, ModelObject: new Tbl_Profile(), ImageUrlPath: "" }));
                }
            }, {
                name: "Editar Perfil",
                action: async (ev) => {
                    await this.NavigateToEdit();
                }
            }, {
                name: "Editar Contraseña",
                action: async (ev) => {
                    this.append(new WModalForm({
                        title: "CAMBIO DE CONTRASEÑA",
                        EditObject: { Password: "" },
                        ModelObject: new ChangePasswordModel(),
                        StyleForm: "ColumnX1",
                        ObjectOptions: { Url: "../api/ApiEntitySECURITY/changePassword" }
                    }));
                }
            }
        ]
    });
    EditProfile = async () => {
        const InvestigadorModel = new Tbl_Profile({
            Cat_Dependencias: undefined, Tbl_Servicios: undefined
        });
        const EditForm = WRender.Create({
            className: "FormContainer", style: {
                padding: "10px",
                borderRadius: ".3cm",
                boxShadow: "0 0 4px 0 rgb(0 0 0 / 40%)",
                margin: "10px"
            }, children: [
                new WForm({
                    ModelObject: InvestigadorModel,
                    EditObject: this.response,
                    ImageUrlPath: "",
                    ObjectOptions: { Url: "../../api/ApiProfile/SaveProfile" },
                })
            ]
        });
        this.TabManager.NavigateFunction("Tab-Editar", EditForm);
    }


    async NavigateToEdit() {
        this.response = await WAjaxTools.PostRequest("../../api/ApiProfile/TakeProfile");
        this.TabManager.NavigateFunction("Tab-Edit-Generales",
            new WForm({
                AutoSave: true,
                EditObject: this.response,
                ModelObject: new Tbl_Profile({ Cat_Dependencias: undefined, Tbl_Servicios: undefined }),
                ImageUrlPath: ""
            }));
    }

    connectedCallback() { }
    DrawComponent = async () => {
        this.append(this.TabContainer);
    }
    WStyle = css`
        w-app-navigator {
            display: block;
            margin-bottom: 20px;
        }

        .OptionContainer {
            display: flex;
            justify-content: center;
        }

        .OptionContainer img {
            box-shadow: 0 0 4px rgb(0, 0, 0/50%);
            height: 100px;
            width: 100px;
            margin: 10px;
        }
        .GrupoContainer {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .TabContainer {
            overflow: hidden;
            overflow-y: auto;
        }

        .FormContainer {
            background-color: var(--secundary-color);
        }

        @media (max-width: 600px) {}
        `
}

customElements.define('w-perfil', PerfilClass);
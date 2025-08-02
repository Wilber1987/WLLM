//@ts-check
//import { Cat_Dependencias, Tbl_Servicios } from "../../ModelProyect/Tbl_CaseModule.js";
import { WForm } from "../../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WAjaxTools.js";


//@ts-check
class Tbl_Profile extends EntityClass {
    constructor(props) {
        super(props, 'Profile');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty}*/ Id_Perfil = { type: 'number', primary: true , hiddenFilter: true};
    /**@type {ModelProperty}*/ Nombres = { type: 'text' };
    /**@type {ModelProperty}*/ Apellidos = { type: 'text' };
    /**@type {ModelProperty}*/ FechaNac = { type: 'date', label: "fecha de nacimiento" , hiddenFilter: true };
    /**@type {ModelProperty}*/ Sexo = { type: "Select", Dataset: ["Masculino", "Femenino"]  , hiddenFilter: true};
    /**@type {ModelProperty}*/ Foto = { type: 'img', require: false , hiddenFilter: true };
    /**@type {ModelProperty}*/ DNI = { type: 'text' };

    /**@type {ModelProperty}*/ Correo_institucional = { type: 'text', label: "correo", disabled: true, hidden: true };
    /**@type {ModelProperty}*/ Estado = { type: "Select", Dataset: ["ACTIVO", "INACTIVO"] };

    /** campos de investigaciones */
    //**@type {ModelProperty}*/ Tbl_Grupos_Profiles = { type: 'masterdetail', require: false , ModelObject: ()=> new Tbl_Grupos_Profiles_ModelComponent() };
    /**@type {ModelProperty}*/ ORCID = { type: 'text', require: false  , hiddenFilter: true};
}

export { Tbl_Profile };

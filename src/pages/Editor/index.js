import React, { useState, useEffect } from "react";

import { Header } from "../../components";
import Voltar from "../../assets/img/voltar.png";
import ArrowRight from "../../assets/img/arrow-right.png";
import ArrowLeft from "../../assets/img/arrow-left.png";

import {
  getAssociate,
  getAssociateEmail,
  validateEmail,
  sendEmail,
} from "../../services/requests";

import "./style.css";

export default function Editor() {
  const [values, setValues] = useState([]);
  const [User, setUser] = useState([]);
  const [Email, setEmail] = useState([]);
  const [texto, setTexto] = useState("");
  const [pagina, setPagina] = useState(0);
  const [paginaSrc, setPaginaSrc] = useState("");

  function handleChange(value) {
    setValues((preValue) => ({
      ...preValue,
      [value.target.name]: value.target.value,
    }));
  }

  let use = window.location.href
    .split("=")[2]
    .split("%20")
    .join(" ")
    .split("&fk");

  useEffect(() => {
    getAssociate(window.location.href.split("=")[3]).then((resp) => {
      setUser(resp.data);
    });

    getAssociateEmail(
      window.location.href.split("=")[1].split("&nome")[0]
    ).then((response) => {
      setEmail(response);
      setPaginaSrc(response.pagina);
      var paginaEx = response.pagina;
      setPagina(paginaEx.split("_")[1].split(".")[0]);
      setTexto(response.corpo.toString());
    });
  }, []);

  function formatar(n) {
    if (n.length === 4) {
      return n;
    } else if (n.length === 3) {
      return "0" + n;
    } else if (n.length === 2) {
      return "00" + n;
    } else if (n.length === 1) {
      return "000" + n;
    }
  }

  var paginaSub = (numero) => {
    if (numero !== 1) {
      numero = parseInt(numero) - 1;
      var link =
        paginaSrc.substring(0, paginaSrc.lastIndexOf("_") + 1) +
        formatar(numero.toString()) +
        ".pdf";
      setPaginaSrc(link);
      setPagina(Number(numero));
    }
  };

  var paginaSom = (numero) => {
    numero = parseInt(numero) + 1;
    var link =
      paginaSrc.substring(0, paginaSrc.lastIndexOf("_") + 1) +
      formatar(numero.toString()) +
      ".pdf";
    setPaginaSrc(link);
    setPagina(Number(numero));
  };

  return (
    <>
      <Header />
      <div className="back-button-edit">
        <a href="/home">
          <img src={Voltar} alt="Voltar" />
        </a>
        <h3>{use}</h3>
      </div>
      <div className="edit">
        <div>
          <iframe className="pdf" src={paginaSrc} width="100%" height="500px" />

          <div className="arrow-page">
            <button className="arrow-button" onClick={() => paginaSub(pagina)}>
              <img className="ArrowImg" src={ArrowLeft} alt="Seta Direita" />
            </button>
            <p> Página:{pagina}</p>
            <button className="arrow-button" onClick={() => paginaSom(pagina)}>
              <img className="ArrowImg" src={ArrowRight} alt="Seta Esquerda" />
            </button>
          </div>
        </div>
        <textarea
          defaultValue={texto}
          type="text"
          onChange={handleChange}
          rows="5"
          cols="30"
          className="email-body"
          name="emailCrpo"
        />
      </div>
      <div className="button-edit">
        <a href="/home">
          <button
            onClick={() =>
              validateEmail(Email.id_email, values.emailCrpo, texto)
            }
            className="validate-button"
          >
            VALIDAR EMAIL
          </button>
        </a>
        <a href="/home">
          <button
            onClick={() =>
              sendEmail(
                Email.id_email,
                values.emailCrpo,
                texto,
                Email.fk_id_associado,
                use[0],
                User.email
              )
            }
            className="send-button"
          >
            ENVIAR EMAIL
          </button>
        </a>
      </div>
    </>
  );
}
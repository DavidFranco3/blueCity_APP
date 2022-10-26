import { useState } from 'react';
import "./ModificaCategorias.scss";
import Dropzone from "../../Dropzone";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {subeArchivosCloudinary} from "../../../api/cloudinary";
import {toast} from "react-toastify";
import {actualizaCategoria} from "../../../api/categorias";
import queryString from "query-string";

function ModificaCategorias(props) {
    const { datosCategorias, history, setShowModal } = props;
    const { id } = datosCategorias;
    //console.log(datosCategorias)

    // Para almacenar la imagen
    const [imagenFile, setImagenFile] = useState(datosCategorias.imagen);

    // Para almacenar el valor del formulario
    const [formData, setFormData] = useState(initialFormData(datosCategorias));
    
      // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    // Para la animacion de carga
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();

        let fotoProducto = datosCategorias.imagen;
        if(!imagenFile) {
            toast.warning("Debes agregar una imagen a la categoría")
        } else {
            if (!formData.nombre) {
                        setLoading(false);
                        toast.warning("Completa el formulario");
                    } else {
            try {
                setLoading(true);
                // Sube a cloudinary la imagen principal del producto
                subeArchivosCloudinary(imagenFile, "categoria").then(response => {
                    const { data } = response;
                    fotoProducto = data.secure_url;

                        setLoading(true);
                        
                        const dataTemp = {
                        nombre: formData.nombre,
                        imagen: fotoProducto,
                        negocio: "LA NENA"
                    }

                            actualizaCategoria(id, dataTemp).then(response =>
                            {
                                const { data } = response;
                                    setLoading(true);
                                    history.push({
                                        search: queryString.stringify(""),
                                    });
                                    toast.success("Categoría modificada");
                                    setShowModal(false);
                                
                            })
                        
                }).then(e => {
                    //console.log(e)
                })
            } catch (e) {
                //console.log(e)
            }
        }
    }
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="imagenPrincipal">
                    <h4 className="textoImagenPrincipal">Sube tu imagen</h4>
                    <div title="Seleccionar imagen de la categoría" className="imagenProducto">
                        <Dropzone
                            setImagenFile={setImagenFile}
                            imagenProductoBD={datosCategorias.imagen}
                        />
                    </div>
                </div>

                <div className="datosDelProducto">
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" name="nombre"
                                          placeholder="Escribe el nombre"
                                          defaultValue={formData.nombre}
                            />
                        </Form.Group>
                    </Row>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Modificar categoría"
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={loading}
                            >
                                {!loading ? "Modificar categoría" : <Spinner animation="border" />}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                title="Cerrar ventana"
                                variant="danger"
                                className="cancelar"
                                disabled={loading}
                                onClick={() => {
                                    cancelarRegistro()
                                }}
                            >
                                Cancelar
                            </Button>
                        </Col>
                    </Form.Group>
            </Form>
        </>
    );
}

function initialFormData(data){
    return {
        nombre: data.nombre
    }
}

export default ModificaCategorias;

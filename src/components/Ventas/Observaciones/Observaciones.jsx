import {useState} from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import "./Observaciones.scss";

function Observaciones(props) {
    const { setObservaciones, setShowModal } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        // console.log(formData)
        setLoading(true);
        setObservaciones(formData.observaciones);
        setShowModal(false);
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="observaciones">
                    <Form.Group as={Col} controlId="formGridObsrevaciones">
                        <Form.Label>
                            Observaciones
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            name="observaciones"
                            placeholder="Escribe los detalles ...."
                            style={{ height: '100px' }}
                            defaultValue={formData.observaciones}
                        />
                    </Form.Group>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Agregar Observaciones" 
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={!formData.observaciones}
                            >
                                {!loading ? "Aceptar" : <Spinner animation="border" />}
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

function initialFormValue(){
    return {
        observaciones: ""
    }
}

export default Observaciones;

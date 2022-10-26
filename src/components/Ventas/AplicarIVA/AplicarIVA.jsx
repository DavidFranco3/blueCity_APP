import {useState} from 'react';
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import "./AplicarIVA.scss";

function Observaciones(props) {
    const { setIVA, setShowModal } = props;
    const [formData, setFormData] = useState(initialFormValue());
    const [loading, setLoading] = useState(false);

    const onSubmit = e => {
        e.preventDefault();
        // console.log(formData)
        setLoading(true);
        setIVA("0.16");
        setShowModal(false);
    }
    
    // Para cancelar el registro
    const cancelarRegistro = () => {
        setShowModal(false)
    }

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Form onSubmit={onSubmit} onChange={onChange}>
                <div className="observaciones">
                    <Form.Group as={Col} controlId="formGridObsrevaciones">
                    <Form.Label>
                        ¿Aplicar IVA?
                     </Form.Label>
                        <Form.Control
                            type="text"
                            name="IVA"
                            value="16%"
                        />
                    </Form.Group>
                </div>

                <Form.Group as={Row} className="botonSubirProducto">
                        <Col>
                            <Button
                                title="Agregar IVA" 
                                type="submit"
                                variant="success"
                                className="registrar"
                                disabled={loading}
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

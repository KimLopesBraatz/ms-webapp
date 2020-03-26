import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { TransitionProps } from "@material-ui/core/transitions";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Slide,
    DialogActions,
    Button,
    TextField,
    ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails
} from "@material-ui/core";
import axiosInstance from "../api/axiosConfig";

export default class Modal extends Component<{ person: any; openModal: any; onClose: any }, {person: any}> {
    constructor(props: any) {
        super(props);
        this.state = {
            person: {
                id: null,
                name: '',
                itin: '',
                dateOfBirth: '',
                email: '',
            },
        }
    }

    save = () => {
        let personToSave = {
            person: this.state.person,
        };
        axiosInstance.post('/person/save', personToSave).then(response => {
            console.log(response);
        });
    };


    cancel = () => {
        this.props.onClose();
    };


    handleName = (event: any) => {
        let nameValue = event.target.value;
        this.setState(
            prevState => (
                {
                    person: {
                        ...prevState.person,
                        name: nameValue
                    }
                }
            )
        );
    };

    handleItin = (event: any) => {
        let itinValue = event.target.value;
        this.setState(
            prevState => (
                {
                    person: {
                        ...prevState.person,
                        itin: itinValue
                    }
                }
            )
        );
    };

    handleDateOfBirth = (event: any) => {
        let dateOfBirthValue = event.target.value;
        this.setState(
            prevState => (
                {
                    person: {
                        ...prevState.person,
                        dateOfBirth: dateOfBirthValue
                    }
                }
            )
        );
    };

    handleEmail = (event: any) => {
        let emailValue = event.target.value;
        this.setState(
            prevState => (
                {
                    person: {
                        ...prevState.person,
                        email: emailValue
                    }
                }
            )
        );
    };

    render() {
        const title = this.props.person === null ? 'Cadastrar Pessoa' : 'Editar Pessoa';
        const { name, itin, dateOfBirth, email } = (this.props.person) ? this.props.person : this.state.person;
        return(
            <Dialog open={ this.props.openModal } onClose={ () => this.cancel }
                    TransitionComponent={Transition} fullWidth={ true } maxWidth='md' keepMounted>
                <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
                <DialogContent style={{ minHeight: '300px'}} dividers>
                    {/*<form noValidate>*/}
                        <TextField value={name} onChange={this.handleName} style={{ width: "100%" }} id="nome" label="Nome" variant="outlined" />
                        <TextField value={itin} onChange={this.handleItin} style={{ width: "49%", marginTop: 10 }} id="cpf" label="CPF" variant="outlined" />
                        <TextField value={dateOfBirth} onChange={this.handleDateOfBirth} style={{ width: "49%", marginTop: 10, float: 'right' }} id="dtNascimento" label="Data de nascimento" variant="outlined" />
                        <TextField value={email} onChange={this.handleEmail} style={{ width: "100%", marginTop: 10 }} id="email" label="E-mail" variant="outlined" />
                        <ExpansionPanel style={{ marginTop: 15 }}>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
                                aria-controls="address-content" id="address">
                                <Typography>Endereços</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    <TextField style={{ width: "100%"}} id="logradouro" label="Logradouro" variant="outlined" />
                                    <TextField style={{ width: "49%", marginTop: 10 }} id="cep" label="CEP" variant="outlined" />
                                    <TextField style={{ width: "49%", marginTop: 10, float: 'right' }} id="bairro" label="Bairro" variant="outlined" />
                                    <TextField style={{ width: "49%", marginTop: 10 }} id="cidade" label="Cidade" variant="outlined" />
                                    <TextField style={{ width: "49%", marginTop: 10, float: 'right' }} id="uf" label="UF" variant="outlined" />
                                    <Button style={{ marginTop: 10 }} color='primary'>Adicionar</Button>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>

                        <ExpansionPanel style={{ marginTop: 15 }}>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Telefones</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    <TextField style={{ width: "30%", marginTop: 10 }} id="ddd" label="DDD" variant="outlined" />
                                    <TextField style={{ width: "69%", marginTop: 10, float: 'right' }} id="numero" label="Numero" variant="outlined" />
                                    <Button style={{ marginTop: 10 }} color='primary'>Adicionar</Button>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    {/*</form>*/}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.save} variant="contained" color="primary"
                            startIcon={<SaveIcon />}>
                        Salvar
                    </Button>
                    <Button onClick={ this.cancel } variant="contained" color='secondary'>
                        Cancelar
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const Transition = React.forwardRef<unknown, TransitionProps>(
    function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    }
);

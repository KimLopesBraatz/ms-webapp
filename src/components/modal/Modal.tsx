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
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell, TableBody
} from "@material-ui/core";
import axiosInstance from "../api/axiosConfig";
import Paper from "@material-ui/core/Paper";
import IPhone from "../../model/IPhone";

export default class Modal extends Component<{
    person: any; openModal: any; onClose: any; refreshList: any; handleInputs: any
}, {person: any; phones: any; phone: any}> {
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
            phones: [],
            phone: {
                id: null,
                areaCode: '',
                number: null,
            },
        }
    }

    save = () => {
        let person = (this.props.person !== null) ? this.props.person : this.state.person;
        let personToSave = {
            person: this.getPersonWithDateOfBirth(person),
            phones: this.state.phones,
        };
        axiosInstance.post('/person/save', personToSave).then(response => {
            this.props.refreshList();
            this.props.onClose();
        });
    };

    getPersonWithDateOfBirth = (person: any) => {
        let newPerson = person;
        newPerson.dateOfBirth = new Date(person.dateOfBirth);
      return newPerson;
    };

    cancel = () => {
        this.props.onClose();
    };

    handleName = (event: any) => {
        let nameValue = event.target.value;
        if (this.isPersonPropsNonNull()) {
            this.props.handleInputs.inputName(nameValue);
        }
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
        if (this.isPersonPropsNonNull()) {
            this.props.handleInputs.inputItin(itinValue);
        }
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
        if (this.isPersonPropsNonNull()) {
            this.props.handleInputs.inputDateOfBirth(dateOfBirthValue);
        }
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
        if (this.isPersonPropsNonNull()) {
            this.props.handleInputs.inputEmail(emailValue);
        }
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

    renderAddresses = () => {
      return (
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
      )
    };

    addPhone = () => {
        let phoneList = this.state.phones;
        phoneList.push(this.state.phone);
        this.state.phones.push(this.state.phone);
    };

    handleAreaCode = (event: any) => {
        let areaCodeValue = event.target.value;
        this.setState(
            prevState => (
                {
                    phone: {
                        ...prevState.phone,
                        areaCode: areaCodeValue
                    }
                }
            )
        );
    };

    handleNumber = (event: any) => {
        let numberValue = event.target.value;
        this.setState(
            prevState => (
                {
                    phone: {
                        ...prevState.phone,
                        number: numberValue
                    }
                }
            )
        );
    };

    renderPhones = () => {
        const  {areaCode, number} = this.state.phone;
      return (
          <ExpansionPanel style={{marginTop: 15}} onClick={this.getPhones}>
              <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
              >
                  <Typography>Telefones</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%'}}>
                      <TextField value={areaCode} onChange={this.handleAreaCode} style={{width: "30%", marginTop: 10}} id="ddd" label="DDD" variant="outlined"/>
                      <TextField value={number} onChange={this.handleNumber} style={{width: "50%", marginTop: 10, marginLeft: 8}} id="numero" label="Número"
                                 variant="outlined"/>
                      <Button onClick={this.addPhone} style={{marginLeft: 8}} color='primary'>Adicionar</Button>
                  </div>
                  <div style={{ width: '100%'}}>
                      {this.renderTablePhones()}
                  </div>
              </ExpansionPanelDetails>
          </ExpansionPanel>
      )
    };

    renderTablePhones = () => {
        const list = this.state.phones;
        return ( <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>DDD</TableCell>
                        <TableCell>Numero</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item: IPhone) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.areaCode}</TableCell>
                            <TableCell>{item.number}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>);
    };

    getPhones = () => {
        if (this.isPersonPropsNonNull()) {
            const personId = this.props.person.id;
            axiosInstance.get(`/phone/personid/${personId}`).then(response => {
                this.setState({ phones: response.data });
            });
        }
    };

    isPersonPropsNonNull = () => {
        return this.props.person !== null;
    };

    render() {
        const title = this.props.person === null ? 'Cadastrar Pessoa' : 'Editar Pessoa';
        const { name, itin, dateOfBirth, email } = (this.props.person) ? this.props.person : this.state.person;
        return(
            <Dialog open={ this.props.openModal } onClose={ () => this.cancel }
                    TransitionComponent={Transition} fullWidth={ true } maxWidth='md' keepMounted>
                <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
                <DialogContent style={{ minHeight: '300px'}} dividers>
                    <TextField value={name} onChange={this.handleName} style={{ width: "100%" }} id="nome" label="Nome" variant="outlined" />
                    <TextField value={itin} onChange={this.handleItin} style={{ width: "49%", marginTop: 10 }} id="cpf" label="CPF" variant="outlined" />
                    <TextField value={dateOfBirth} onChange={this.handleDateOfBirth} style={{ width: "49%", marginTop: 10, float: 'right' }} id="dtNascimento" label="Data de nascimento" variant="outlined" />
                    <TextField value={email} onChange={this.handleEmail} style={{ width: "100%", marginTop: 10 }} id="email" label="E-mail" variant="outlined" />
                    {this.renderAddresses()}
                    {this.renderPhones()}
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

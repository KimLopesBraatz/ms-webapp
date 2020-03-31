import React, { Component } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Dialog,
    DialogTitle,
    DialogContent,
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
    TableCell, TableBody, Snackbar
} from "@material-ui/core";
import axiosInstance from "../api/axiosConfig";
import Paper from "@material-ui/core/Paper";
import IPhone from "../../model/IPhone";
import IPerson from "../../model/IPerson";
import IAddress from "../../model/IAddress";

export default class Modal extends Component<
    { person: IPerson; openModal: any; onClose: any; refreshList: any; handleInputs: any } ,
    { person: IPerson; isValidItin: boolean; phones: any; phone: IPhone; addresses: any; address: IAddress; isClosePhoneDetail: boolean; isCloseAddressDetail: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = {
            person: { name: '', itin: '', dateOfBirth: undefined, email: '', },
            isValidItin: true,
            phones: [],
            phone: { areaCode: '', number: undefined, },
            addresses: [],
            address: { city: '', zipCode: undefined, publicArea: '', neighborhood: '', federativeUnit: '', },
            isClosePhoneDetail: true,
            isCloseAddressDetail: true,
        }
    }

    save = () => {
        let personToSave = this.buildPersonToSave();
        axiosInstance.post('/person/save', personToSave).then(response => {
            this.props.refreshList();
            this.props.onClose();
        });
    };

    buildPersonToSave = () => {
        let phoneList = this.state.phones.length > 0 ? this.state.phones : null;
        let addressList = this.state.addresses.length  > 0 ? this.state.addresses : null;
        let person = (this.props.person !== null) ? this.props.person : this.state.person;
        return {
            phones: phoneList,
            addresses: addressList,
            person: this.getPersonWithDateOfBirth(person),
        }
    };

    getPersonWithDateOfBirth = (person: any) => {
        let newPerson = person;
        newPerson.dateOfBirth = new Date(person.dateOfBirth);
        return newPerson;
    };

    cancel = () => {
        this.props.onClose();
        this.resetValues();
    };

    resetValues = () => {
        this.setState({ phones: [] });
        this.setState({ isClosePhoneDetail: true });
        this.setState({ isCloseAddressDetail: true });
        this.setState({ phone: { areaCode: '', number: undefined } });
        this.setState({ person: { name: '', itin: '', dateOfBirth: undefined, email: '' }});
        this.setState({ address: { city: '', zipCode: undefined, publicArea: '', neighborhood: '', federativeUnit: '' }});
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
      const { city, zipCode, publicArea, neighborhood, federativeUnit } = this.state.address;
      return (
          <ExpansionPanel style={{ marginTop: 15 }} onChange={this.getAddresses}>
              <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="address-content" id="address">
                  <Typography>Endereços</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%'}}>
                      <TextField value={publicArea} onChange={this.handlePublicArea} style={{ width: "100%"}} id="logradouro" label="Logradouro" variant="outlined" />
                      <TextField value={zipCode} onChange={this.handleZipCode} style={{ width: "49%", marginTop: 10 }} id="cep" label="CEP" variant="outlined" />
                      <TextField value={neighborhood} onChange={this.handleNeighborhood} style={{ width: "49%", marginTop: 10, float: 'right' }} id="bairro" label="Bairro" variant="outlined" />
                      <TextField value={city} onChange={this.handleCity} style={{ width: "49%", marginTop: 10 }} id="cidade" label="Cidade" variant="outlined" />
                      <TextField value={federativeUnit} onChange={this.handleFederativeUnit} style={{ width: "49%", marginTop: 10, float: 'right' }} id="uf" label="UF" variant="outlined" />
                      <Button onClick={this.addAddress} style={{ marginTop: 10 }} color='primary'>Adicionar</Button>
                  </div>
                  {this.renderTableAddresses()}
              </ExpansionPanelDetails>
          </ExpansionPanel>
      )
    };

    renderTableAddresses = () => {
        let list = this.state.addresses;
        return ( <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Cep</strong></TableCell>
                        <TableCell><strong>Logradouro</strong></TableCell>
                        <TableCell><strong>Bairro</strong></TableCell>
                        <TableCell><strong>Cidade</strong></TableCell>
                        <TableCell><strong>UF</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item: IAddress) => (
                        <TableRow key={item.zipCode} onClick={() => this.editAddress(item)} style={{ cursor: 'pointer' }}>
                            <TableCell>{item.zipCode}</TableCell>
                            <TableCell>{item.publicArea}</TableCell>
                            <TableCell>{item.neighborhood}</TableCell>
                            <TableCell>{item.city}</TableCell>
                            <TableCell>{item.federativeUnit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>);
    };

    getAddresses = () => {
        if (this.isPersonPropsNonNull() && this.state.isCloseAddressDetail) {
            const personId = this.props.person.id;
            axiosInstance.get(`/address/personid/${personId}`).then(response => {
                this.setState({ addresses: response.data });
                this.setState({ isCloseAddressDetail: false });
            });
        }
    };

    editAddress = (address: IAddress) => {
        this.setState({ address: address });
    };

    addAddress = () => {
        let newAddress = this.state.address;
        if (this.state.phones.address <= 0) {
            this.setState({ addresses: [...this.state.addresses, newAddress] });
            this.setState({ address: { city: '', zipCode: undefined, publicArea: '', neighborhood: '', federativeUnit: '' }});
        }
    };

    handlePublicArea = (event: any) => {
        let publicAreaValue = event.target.value;
        this.setState(prevState => ({
            address: {...prevState.address, publicArea: publicAreaValue}
        }));
    };

    handleNeighborhood = (event: any) => {
        let neighborhoodValue = event.target.value;
        this.setState(prevState => ({
            address: {...prevState.address, neighborhood: neighborhoodValue}
        }));
    };

    handleCity = (event: any) => {
        let cityValue = event.target.value;
        this.setState(prevState => ({
            address: {...prevState.address, city: cityValue}
        }));
    };

    handleFederativeUnit = (event: any) => {
        let federativeUnitValue = event.target.value;
        this.setState(prevState => ({
            address: {...prevState.address, federativeUnit: federativeUnitValue}
        }));
    };

    handleZipCode = (event: any) => {
        let zipCodeValue = event.target.value;
        this.setState(prevState => ({
            address: {...prevState.address, zipCode: zipCodeValue}
        }));
    };

    handleAreaCode = (event: any) => {
        let areaCodeValue = event.target.value;
        this.setState(prevState => ({
            phone: {...prevState.phone, areaCode: areaCodeValue}
        }));
    };

    handleNumber = (event: any) => {
        let numberValue = Number.parseInt(event.target.value);
        this.setState(prevState => ({
            phone: {...prevState.phone, number: numberValue}
        }));
    };

    renderPhones = () => {
        const  { areaCode, number } = this.state.phone;
        return (
            <ExpansionPanel style={{marginTop: 15}} onChange={this.getPhones}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1a-content" id="panel1a-header">
                    <Typography>Telefones</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '100%'}}>
                      <TextField value={areaCode} onChange={this.handleAreaCode} style={{width: "30%", marginTop: 10}} id='ddd' label='DDD' variant='outlined'/>
                      <TextField value={number} onChange={this.handleNumber} style={{width: "50%", marginTop: 10, marginLeft: 8}} id='numero' label='Número'
                                 variant="outlined"/>
                      <Button onClick={this.addPhone} style={{marginLeft: 8, marginTop: 20}} color='primary'>Adicionar</Button>
                  </div>
                  {this.renderTablePhones()}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    };

    renderTablePhones = () => {
        let list = this.state.phones;
        return ( <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>DDD</strong></TableCell>
                        <TableCell><strong>Numero</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list.map((item: IPhone) => (
                        <TableRow key={item.number} onClick={() => this.editPhone(item)} style={{ cursor: 'pointer' }}>
                            <TableCell>{item.areaCode}</TableCell>
                            <TableCell>{item.number}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>);
    };

    getPhones = () => {
        if (this.isPersonPropsNonNull() && this.state.isClosePhoneDetail) {
            const personId = this.props.person.id;
            axiosInstance.get(`/phone/personid/${personId}`).then(response => {
                this.setState({ phones: response.data });
                this.setState({ isClosePhoneDetail: false });
            });
        }
    };

    editPhone = (phone: IPhone) => {
        this.setState({ phone: phone });
    };

    addPhone = () => {
        let newPhone = this.state.phone;
        if (this.state.phones.length <= 0 || this.phoneNotIncluded(newPhone)) {
            this.setState({ phones: [...this.state.phones, newPhone] });
            this.setState({ phone: { areaCode: '', number: undefined } });
        }
    };

    phoneNotIncluded = (phone: any) => {
        return this.state.phones.length > 0 &&
            !this.state.phones.some((p: IPhone) => p.areaCode === phone.areaCode && p.number === phone.number);
    };

    isPersonPropsNonNull = () => {
        return this.props.person !== null;
    };

    validItin = () => {
        let itin = (this.props.person) ? this.props.person.itin : this.state.person.itin;
        // @ts-ignore
        itin = itin.trim().replace(/[^\d]+/g,'');
        if(itin.trim().length === 0) {
            this.setState({ isValidItin: false });
            return false;
        }

        if (itin.length !== 11 || itin === "00000000000" || itin === "11111111111" || itin === "22222222222" ||
            itin === "33333333333" || itin === "44444444444" || itin === "55555555555" || itin === "66666666666" ||
            itin === "77777777777" || itin === "88888888888" || itin === "99999999999") {
            this.setState({ isValidItin: false });
            return false;
        }

        let add = 0;
        for (let i=0; i < 9; i ++)
            add += parseInt(itin.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(itin.charAt(9))) {
            this.setState({ isValidItin: false });
            return false;
        }

        add = 0;
        for (let i = 0; i < 10; i ++)
            add += parseInt(itin.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== parseInt(itin.charAt(10))) {
            this.setState({ isValidItin: false });
            return false;
        }
        this.setState({ isValidItin: true });
        return true;
    };

    render() {
        const title = this.props.person === null ? 'Cadastrar Pessoa' : 'Editar Pessoa';
        const { name, itin, dateOfBirth, email } = (this.props.person) ? this.props.person : this.state.person;
        let show = (!this.state.isValidItin) ? 'block' : 'none';
        return(
            <Dialog open={ this.props.openModal } fullWidth={ true } maxWidth='md'>
                <DialogTitle id="title">{title}</DialogTitle>
                <DialogContent style={{ minHeight: '300px'}} dividers>
                    <TextField value={name} onChange={this.handleName} style={{ width: "100%" }} id="nome" label="Nome" variant="outlined" />
                    <TextField value={itin} onChange={this.handleItin} onBlur={this.validItin} style={{ width: "49%", marginTop: 10 }} id="cpf" label="CPF" variant="outlined" />
                    <TextField value={dateOfBirth} onChange={this.handleDateOfBirth} style={{ width: "49%", marginTop: 10, float: 'right' }} id="dtNascimento" label="Data de nascimento" variant="outlined" />
                    <TextField value={email} onChange={this.handleEmail} style={{ width: "100%", marginTop: 10 }} id="email" label="E-mail" variant="outlined" />
                    <span style={{ display: show, marginTop: 10, color: 'red' }}>{`CPF invalido!`}</span>
                    {this.renderAddresses()}
                    {this.renderPhones()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.save} variant="contained" color="primary"
                            disabled={!this.state.isValidItin}
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

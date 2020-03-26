import React, { Component } from 'react';
import '../../styles/App.css';
import axiosInstance from '../api/axiosConfig';
import TableList from "../table/TableList";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import {AppBar, Toolbar, InputBase, IconButton, Fab} from '@material-ui/core';
import Modal from "../modal/Modal";

export default class Home extends Component<any, { personList: any; editPerson: any; openModal: boolean; handleInputs: any}> {
    constructor(props: any) {
        super(props);
        this.state = {
            personList: [],
            editPerson: null,
            openModal: false,
            handleInputs: {
                inputName: this.handleName,
                inputItin: this.handleItin,
                inputDateOfBirth: this.handleDateOfBirth,
                inputEmail: this.handleEmail,
            }
        }
    }

    componentDidMount(): void {
        axiosInstance.get('/person').then(response => {
            this.setState({ personList: response.data });
        });
    }

    handleClickOpen = (person: any) => {
        this.setState({ openModal: true });
        this.setState({ editPerson: person });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });
        this.setState({ editPerson: null });
    };

    refreshList = () => {
        axiosInstance.get('/person').then(response => {
            this.setState({ personList: response.data });
        });
    };

    handleName = (nameValue: string) => {
        this.setState(
            prevState => (
                {
                    editPerson: {
                        ...prevState.editPerson,
                        name: nameValue
                    }
                }
            )
        );
    };

    handleItin = (itinValue: string) => {
        this.setState(
            prevState => (
                {
                    editPerson: {
                        ...prevState.editPerson,
                        itin: itinValue
                    }
                }
            )
        );
    };

    handleDateOfBirth = (dateOfBirthValue: string) => {
        this.setState(
            prevState => (
                {
                    editPerson: {
                        ...prevState.editPerson,
                        dateOfBirth: dateOfBirthValue
                    }
                }
            )
        );
    };

    handleEmail = (emailValue: string) => {
        this.setState(
            prevState => (
                {
                    editPerson: {
                        ...prevState.editPerson,
                        email: emailValue
                    }
                }
            )
        );
    };

    render() {
        return(
            <div>
                <AppBar position='fixed' color='transparent'
                        style={{ backgroundColor: '#fd610b',
                            backgroundPosition: 'right', backgroundSize: 'auto',
                            backgroundRepeat: 'no-repeat' }}>
                    <Toolbar>
                        <div style={{ float: 'left' }}>
                            <h2 style={{ color: 'white' }}>Pessoas</h2>
                        </div>
                    </Toolbar>
                </AppBar>
                <div>
                    <TableList personList={this.state.personList} openModal={this.handleClickOpen}/>
                </div>
                <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <Fab onClick={() => this.handleClickOpen(null)}
                         style={{ float: 'right', margin: 40 }} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Modal openModal={this.state.openModal} onClose={this.handleCloseModal}
                           person={this.state.editPerson} refreshList={this.refreshList}
                           handleInputs={this.state.handleInputs}
                    />
                </div>
            </div>
        );

    }

}

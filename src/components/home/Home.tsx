import React, { Component } from 'react';
import '../../styles/App.css';
import axiosInstance from '../api/axiosConfig';
import TableList from "../table/TableList";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import {AppBar, Toolbar, InputBase, IconButton, Fab} from '@material-ui/core';
import Modal from "../modal/Modal";

export default class Home extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            personList: [],
            editPerson: {},
            openModal: false,
        }
    }

    componentDidMount(): void {
        axiosInstance.get('/person').then(response => {
            console.log(response);
            this.setState({ personList: response.data });
        });
    }

    handleClickOpen = (person: any) => {
        this.setState({ openModal: true });
        this.setState({ editPerson: person });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });
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
                            <IconButton type='submit' aria-label='search' style={{ padding: 10 }}>
                                <SearchIcon />
                            </IconButton>
                            <InputBase style={{ marginLeft: 10, flex: 1 }}
                                placeholder="Pesquisar..."
                                inputProps={{ 'aria-label': 'Pesquisar...' }}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
                <div>
                    <TableList personList={this.state.personList} openModal={this.handleClickOpen}/>
                </div>
                <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>
                    <Fab onClick={() => this.handleClickOpen(null)} style={{ float: 'right', margin: 40 }} color="primary" aria-label="add">
                        <AddIcon />
                    </Fab>
                    <Modal openModal={this.state.openModal} onClose={this.handleCloseModal} person={this.state.editPerson}/>
                </div>
            </div>
        );

    }

}

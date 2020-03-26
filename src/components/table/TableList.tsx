import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IPerson from "../../model/IPerson";

export default class TableList extends Component<any, any>{

    renderTableBody = () => {
        const list = this.props.personList;
        if (list.length > 0) {
            return (<TableBody>
                {list.map((item: IPerson) => (
                    <TableRow key={item.id} onClick={ () => this.props.openModal(item) } style={{ cursor: 'pointer' }}>
                        <TableCell component="th" scope="row">{item.name}</TableCell>
                        <TableCell align="left">{item.email}</TableCell>
                        <TableCell align="left">{item.itin}</TableCell>
                        <TableCell align="left">{item.dateOfBirth}</TableCell>
                        <TableCell align="left">{item.createdIn}</TableCell>
                    </TableRow>
                ))}
            </TableBody>)
        }
        return (<TableBody></TableBody>);
    };

    render() {
        return (
            <TableContainer component={Paper} style={{ marginTop: 70 }}>
                <Table style={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell align="left">E-mail</TableCell>
                            <TableCell align="left">CPF</TableCell>
                            <TableCell align="left">Data Nascimento</TableCell>
                            <TableCell align="left">Cadastrado em</TableCell>
                        </TableRow>
                    </TableHead>
                    {this.renderTableBody()}
                </Table>
            </TableContainer>
        );
    }
}

import React, { Component } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
const axios = require('axios');
var i;
const user = localStorage.getItem("JWT");

let schedule = null;
let replacement = null;
const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(AcademicMember, Course, Day, Location, Slot, Type) {
    return { AcademicMember, Course, Day, Location, Slot, Type };
}

export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            schedule: {},
            replacement: {},
            row: [],
            replacementrow: []
        }
    }
    schedules() {
        const schedules = axios.get('http://localhost:3001/AcademicMember/viewSchedule',
            { headers: { "token": user } })
            .then((response) => {
                this.setState({ schedule: response.data.schedule, replacement: response.data.ReplacementSchedule })
                console.log(response.data)
            })
            .then(res => {
                console.log(this.state.schedule.length != 0)
                if(this.state.replacement.length != 0){
                    const rows= [];
                            for ( i = 0; i < this.state.schedule.length; i++) {    
                            rows[i] = createData(this.state.schedule[i].academicMember,
                             this.state.schedule[i].course,
                             this.state.schedule[i].day,
                             this.state.schedule[i].location,
                             this.state.schedule[i].slot,
                             "Schedule")
                             };
                             for ( i = 0; i < this.state.replacement.length; i++) {
                               rows.push(
                                 createData(
                                  this.state.schedule[i].academicMember,
                                  this.state.schedule[i].course,
                                  this.state.replacement[i].day,
                                  this.state.schedule[i].location,
                                  this.state.replacement[i].slot,
                                 )
                               )
                             }
                      this.setState({row : rows})
                } 
                else {
                    const rows = [];
                    for (i = 0; i < this.state.schedule.length; i++) {
                        rows[i] = createData(this.state.schedule[i].academicMember,
                            this.state.schedule[i].course,
                            this.state.schedule[i].day,
                            this.state.schedule[i].location,
                            this.state.schedule[i].slot,
                            "Schedule")
                    };
                    this.setState({ row: rows })
                }
            });
    }
    componentDidMount() {
        this.schedules();
    }

    render() {
        const rows = this.state.row;
        return (
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Academic Member</StyledTableCell>
                                <StyledTableCell align="center">Course</StyledTableCell>
                                <StyledTableCell align="center">Day&nbsp;</StyledTableCell>
                                <StyledTableCell align="center">Location&nbsp;</StyledTableCell>
                                <StyledTableCell align="center">Slot&nbsp;</StyledTableCell>
                                <StyledTableCell align="center">Type&nbsp;</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.AcademicMember}>
                                    <StyledTableCell align="center">{row.AcademicMember}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Course}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Day}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Location}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Slot}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Type}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        );
    }
}
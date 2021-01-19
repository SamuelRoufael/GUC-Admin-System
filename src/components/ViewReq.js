import "../css/requests.css"
import React, { Component } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { message } from 'antd';
import 'antd/dist/antd.css';
var i;

const user1 = localStorage.getItem("JWT")

const axios = require('axios');
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

function createData(Sender, Reciver, Status, _id) {
    return { Sender, Reciver, Status, _id };
}

export default class ViewReq extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            requests: {},
            clicked: false,
            row: [],
            tmp: [],
            tmp1: [],
            tmp2: [],
            tmp3: [],
            status: "",
            tmp4:[],
            replacment:[]
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    async getAccepted() {
        const response =
            await axios.get("http://localhost:3001/AcademicMember/ViewRequest",
                {
                    headers: { "token": user1 }
                }
            ).then((response) => {
                this.setState({ requests: response.data })
                console.log(this.state.requests)
                const rows = [];
                const replacment=[];
                for (i = 0; i < this.state.requests.length; i++) {
                    rows[i] =
                        createData(this.state.requests[i].sender,
                            this.state.requests[i].reciver,
                            this.state.requests[i].status,
                            this.state.requests[i]._id)
                        ;
                } 
                for ( i = 0; i < this.state.replacment.length; i++) {
                    if(this.state.replacment[i].type=="Replacement")  
                    replacment[i] = 
                        createData(this.state.replacment[i].sender,
                            this.state.replacment[i].reciver,
                            this.state.replacment[i].status,
                            this.state.replacment[i]._id )
                             ;             
                }this.setState({row:rows , tmp:rows ,tmp4:replacment})
                const rowsPending = this.state.row.filter(i => i.Status == "Pending")
                this.setState({ tmp1: rowsPending })
                console.log(this.state.tmp1)
                const rowsAccepted = this.state.row.filter(i => i.Status == "Accepted")
                this.setState({ tmp2: rowsAccepted })
                const rowsRejected = this.state.row.filter(i => i.Status == "Rejected")
                this.setState({ tmp3: rowsRejected })
            })
    }
    componentDidMount() {
        this.getAccepted();
    }
    async handleClick(item) {
        const id = item._id;
        const response = await axios.post('http://localhost:3001/AcademicMember/CancelRequest', 
            {    _id: id
            }, { headers : {"token" : user1}}
        )
        const rows = this.state.row.filter(i => i._id !== item._id)
        this.setState({ row: rows, tmp: rows })
        if(response.data === "Request deleted successfully!"){
            message.success("Request deleted successfully!")
        }
        else if(response.data === "you can't cancel this request!"){
            message.warning("you can't cancel this request!")
        }
    }
    handleChange(stat) {
        if (stat == "All")
            console.log(this.state.row)
        this.setState({ tmp: this.state.row })
        if (stat == "Pending")
            console.log(this.state.tmp1)
        this.setState({ tmp: this.state.tmp1 })
        if (stat == "Accepted")
            this.setState({ tmp: this.state.tmp2 })
        if (stat == "Rejected")
            this.setState({ tmp: this.state.tmp3 })
        if(stat=="Replacement")
            this.setState({tmp:this.state.tmp4})
    }
    render() {
        const rows = this.state.tmp
        return (
            <div className="mainReq">
                <div styles={{display:"flex" , flexDirection:"row" , justifyContent: "space-evenly" , alignItems: "space-evenly"}}>
                    <button className="buttony" onClick={this.handleChange.bind(this, "All")}>All</button>
                    <button className="buttony" onClick={this.handleChange.bind(this, "Pending")}>Pending</button>
                    <button className="buttony" onClick={this.handleChange.bind(this, "Accepted")}>Accepted</button>
                    <button className="buttony" onClick={this.handleChange.bind(this, "Rejected")}>Rejected</button>
                    <button className="buttony" onClick={this.handleChange.bind(this, "Replacement")}>Replacement</button>
                </div>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Status</StyledTableCell>
                                <StyledTableCell align="center">Sender</StyledTableCell>
                                <StyledTableCell align="center">Receiver&nbsp;</StyledTableCell>
                                <StyledTableCell align="center">Action&nbsp;</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <StyledTableRow key={row.Status}>
                                    <StyledTableCell align="center">{row.Status}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Sender}</StyledTableCell>
                                    <StyledTableCell align="center">{row.Reciver}</StyledTableCell>
                                    <StyledTableCell align="center">{<button onClick={this.handleClick.bind(this, row)}>Cancel</button>}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
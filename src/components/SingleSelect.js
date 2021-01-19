import React, { Component } from 'react'
import Select from 'react-select'
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button';
import "../css/stylesHR.css"
const user = localStorage.getItem("JWT");


export default class SingleSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectOptions: [],
            id: "",
            name: '',
            startdate: "",
            enddate: "",
            sender: "",
            comment: "",
            document: "",
            slot: "",
            receiver: "",
            compensationdate: "",
            dayoff: 0
        }
        this.handleInput = this.handleInput.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    async getOptions() {

        const data = [{ id: 1, name: "Annual Leaves" }, { id: 2, name: "Accidental Leaves" },
        { id: 3, name: "Sick Leaves" }, { id: 4, name: "Maternity Leaves" },
        { id: 5, name: "Compensation Leaves" }, { id: 6, name: "Change dayoff" },
        { id: 7, name: "Replacement" }, { id: 8, name: "Slot linking" }]

        const options = data.map(d => ({
            "value": d.id,
            "label": d.name

        }))
        this.setState({ selectOptions: options })
    }
    handleInput(event, key) {
        this.setState({
            [key]: event.target.value
        })
    }
    async handleClick() {
        if (this.state.id == 1) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(this.state.enddate),
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 2) {
            const response = await fetch('http://localhost:3002/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(this.state.enddate),
                    comment: new Date(this.state.comment),
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 3) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(this.state.enddate),
                    document: this.state.document,
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 4) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(),
                    document: this.state.document
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 5) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(this.state.enddate),
                    compensationDate: new Date(this.state.compensationdate),
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 6) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(),
                    endDate: new Date(),
                    newDayOff: this.state.dayoff,
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 7) {
            const response = await fetch('http://localhost:3001/AcademicMember/SendRequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    receiver: this.state.receiver,
                    startDate: new Date(this.state.startdate),
                    endDate: new Date(),
                    slot: this.state.slot,
                }),
            })
            console.log(await response.json())
        }
        if (this.state.id == 8) {
            const response = await fetch('http://localhost:3001/AcademicMember/slotLinking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "token": user },
                body: JSON.stringify({
                    type: this.state.name,
                    startDate: new Date(),
                    endDate: new Date(),
                    schedule: this.state.slot,
                }),
            })
            console.log(await response.json())
        }
    }
    handleChange(e) {
        this.setState({ id: e.value, name: e.label })
    }

    componentDidMount() {
        this.getOptions()
    }
    render() {
        return (
            <Paper className = "mainReq">
                    <label for="type">
                        <b className="Reqtext">Type</b>
                    </label>
                    <Select className="Reqcredentials" options={this.state.selectOptions} onChange={this.handleChange.bind(this)} />
                    {((this.state.name != "Change dayoff") && (this.state.name != "Slot linking")) && (
                        <div className="Reqcredentials" >
                            <label for="startdate">
                                <b className="Reqtext">Start date</b>
                            </label>
                            <input type="date" name="startdate" onChange={event => this.handleInput(event, 'startdate')} />
                            <label for="enddate">
                                <b className="Reqtext">End date</b>
                            </label>
                            <input type="date" name="enddate" onChange={event => this.handleInput(event, 'enddate')} /></div>)}
                    {this.state.name == "Accidental Leaves" && <div className="Reqcredentials"><label for="name">Comment:</label>
                        <input type="text" id="name" name="name"
                            minlength="4" maxlength="100" size="15" onChange={event => this.handleInput(event, 'comment')} />
                    </div>}
                    {((this.state.name == "Sick Leaves") || (this.state.name == "Maternity Leaves")) && <div className="Reqcredentials"><label for="name">Documents:</label>
                        <input type="text" id="name" name="name"
                            minlength="4" maxlength="100" size="25" onChange={event => this.handleInput(event, 'document')} /></div>}
                    {this.state.name == "Compensation Leaves" && <div className="Reqcredentials"><label for="Compensation">
                        <b className="Reqtext">Compensation date</b>
                    </label>
                        <input type="date" name="Compensation" onChange={event => this.handleInput(event, 'compensationdate')} /></div>}
                    {this.state.name == "Replacement" && <div className="Reqcredentials">
                        <label for="reciver">
                            <b className="Reqtext">Reciver</b>
                        </label>
                        <input type="text" placeholder="Enter Reciver ID" name="sender" required onChange={event => this.handleInput(event, 'receiver')} />
                        <label for="name">Schedule ID:</label>
                        <input type="text" id="name" name="name"
                            minlength="4" maxlength="100" size="15" onChange={event => this.handleInput(event, 'slot')} />
                    </div>}
                    {this.state.name == "Change dayoff" && <div className="Reqcredentials"><label for="name">Enter new Day Off 0:6</label>
                        <input type="text" id="name" name="name"
                            minlength="4" maxlength="100" size="15" onChange={event => this.handleInput(event, 'dayoff')} />
                    </div>}
                    {this.state.name == "Slot linking" && 
                    <div className="Reqcredentials" >
                    <label for="name">Schedule ID:</label>
                        <input type="text" id="name" name="name"
                            minlength="4" maxlength="100" size="15" onChange={event => this.handleInput(event, 'slot')} /></div>}
                    <Button className = "buttony" variant="contained" color="primary"  onClick= {this.handleClick}>Submit</Button>
            </Paper>

        )
    }
}
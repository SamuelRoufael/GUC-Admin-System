import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button';
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import axios from 'axios';
import Selector from "./Selector";
import TxtField from "./TxtField";

const columns = [
    { id: "location", label: "Location", minWidth: 100, align: "center" },
    { id: "type", label: "Type", minWidth: 100, align: "center" },
    { id: "currentCapacity", label: "Current capacity", minWidth: 100, align: "center" },
    { id: "maxCapacity", label: "Max capacity", minWidth: 100, align: "center" },
    { id: "delete", label: "Delete", minWidth: 100, align: "center" },
    { id: "update", label: "Update", minWidth: 100, align: "center" }
];

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: 'column',
        // justifyContent: "center",
        alignContent: "center"
    },
    container: {
        maxHeight: "100%"
    },
    button: {
        width: '25ch',
    }
});

export default function LocationsTable() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [rows, setRows] = React.useState([]);
    const [addLocationType, setaddLocationType] = React.useState("Office");
    const [addLocationName, setaddLocationName] = React.useState("");
    const [addLocationCapacity, setAddLocationCapacity] = React.useState(0);
    const [toBeUpdatedLocation,setToBeUpdatedLocation] = React.useState("");
    const [updateLocationType, setUpdateLocationType] = React.useState("");
    const [updateLocationName, setUpdateLocationName] = React.useState("");
    const [updateLocationCapacity, setUpdateLocationCapacity] = React.useState(0);
    const [update, setUpdate] = React.useState(false);
    
    const loadLocations = React.useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3001/HR/viewLocations");
            setRows(response.data);
        } catch (error) {
            setRows([]);
        }
    });

    React.useEffect(() => { loadLocations(); }, [loadLocations]);

    function assignType(selectedType) {
        setaddLocationType(selectedType);
        setUpdate(false);
    }

    function assignLocationName(newName) {
        setaddLocationName(newName);
        setUpdate(false);
    }

    function assignLocationCapacity(newCapacity){
        setAddLocationCapacity(newCapacity);
        setUpdate(false);
    }

    async function addLocation(){
        setUpdate(false);
        try {
            await axios.post("http://localhost:3001/HR/addLocation", {
                location : addLocationName,
                type : addLocationType,
                maxCapacity : addLocationCapacity
            });
            // loadLocations();
        } catch (error) {
            console.log (":(((")
        }
    }

    async function handleDelete(l) {
        try {
            setUpdate(false);
            await axios.post("http://localhost:3001/HR//deleteLocation", { location: l });
            loadLocations();
        } catch (error) {
            // handle Error Page here
            console.log(error)
        }
    }
    
    function updateType(type){
        setUpdateLocationType(type);
    }

    function updateName(name) {
        setUpdateLocationName(name);
    }

    function updateCapacity (capacity){
        setUpdateLocationCapacity(capacity);
    }

    async function updateLocation(){

        let updates_ = {
            maxCapacity : updateLocationCapacity,
            type : updateLocationType}
        if (toBeUpdatedLocation !== updateLocationName)
            updates_.location = updateLocationName    
        try {
            await axios.post("http://localhost:3001/HR/updateLocation",{
                location : toBeUpdatedLocation,
                updates : updates_
            })
            setUpdate(false);
        } catch (error) {
          //  TODO : "Handel error page here"
            console.log(":(")
        }
    }

    function handleUpdate(l) {
        const location = rows.find( (loc) => {
            return loc.location === l;
        })
        setUpdateLocationCapacity(location.maxCapacity);
        setUpdateLocationName(location.location);
        setUpdateLocationType(location.type);
        setToBeUpdatedLocation(location.location);
        setUpdate(true);
    }
    
    const handleChangePage = (event, newPage) => {
        setUpdate(false);
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        setUpdate(false);
    };

    return (
        <Paper className={classes.root} elevation={3}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <StyledTableCell align={column.align}>
                                    {column.label}
                                </StyledTableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, rowIndex) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
                                        {columns.map((column, columnIndex) => {
                                            return (
                                                <TableCell
                                                    key={rowIndex + "" + columnIndex}
                                                    align={column.align}
                                                >
                                                    {column.id === "delete" && (
                                                        <DeleteIcon
                                                            key={row.id}
                                                            onClick={() => handleDelete(row.location)}
                                                        />
                                                    )}
                                                    {column.id === "update" && (
                                                        <UpdateIcon
                                                            key={row.id}
                                                            onClick={() => handleUpdate(row.location)}
                                                        />
                                                    )}
                                                    {column.id === "maxCapacity" && row.maxCapacity}
                                                    {column.id === "currentCapacity" && row.currentCapacity}
                                                    {column.id === "location" && row.location}
                                                    {column.id === "type" && row.type}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

            {update && <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1>Update Location {toBeUpdatedLocation}</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Lecture Hall', 'Tutorial Room', 'Exam Hall']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={updateType}
                    />
                    <TxtField
                        key="newLocationNameSelector"
                        name="name"
                        helperText="Type Location Name"
                        setText={updateName}
                    />
                    <TxtField
                        key="newLocationMaxSize"
                        name="Max Capacity"
                        helperText="Type max capacity"
                        setText={updateCapacity}
                        type="number"
                    />
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (updateLocation())}
                    >
                    Update</Button>
            </div>}
            <div style={{ display: "flex", flexDirection: "column", margin: "5%" , alignItems : "center"}}>
                <h1>Add Location</h1>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent : "center"}}>

                    <Selector
                        key={"newTypeSelector"}
                        selects={['Office', 'Lab', 'Lecture Hall', 'Tutorial Room', 'Exam Hall']}
                        name="Type"
                        helperText="Select location type"
                        setSelector={assignType}
                    />
                    <TxtField
                        key="newLocationNameSelector"
                        name="name"
                        helperText="Type Location Name"
                        setText={assignLocationName}
                    />
                    <TxtField
                        key="newLocationMaxSize"
                        name="Max Capacity"
                        helperText="Type max capacity"
                        setText={assignLocationCapacity}
                        type="number"
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick = {() => (addLocation())}
                    >
                    Add</Button>
            </div>
        </Paper>
    );
}
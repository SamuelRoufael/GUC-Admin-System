import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

// props.mainData [array of Strings]
// props.collapseTitle [String]
// props.collapseHeads [array of Strings]
// props.collapseRows [array of Data]
// props.id
// props.onDelete
// props.onUpdate

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

export default function CollapsedRow(props) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    async function handleDelete() {
        props.onDelete(props.id)
    }

    async function handleUpdate() {
        props.onUpdate(props.id)
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                {props.mainData.map((singleRowElement, index) => {
                    return singleRowElement !== undefined ? <TableCell key={index} align="center">{singleRowElement}</TableCell> :
                        (props.onDelete !== undefined && props.onUpdate !== undefined && index <= props.mainData.length - 3 && <TableCell key={index} align="center">X</TableCell>)
                })}
                {props.onDelete !== undefined && (
                    <TableCell align="center">
                        <DeleteIcon
                            onClick={() => handleDelete()}
                        />
                    </TableCell>)}

                {props.onUpdate !== undefined && (
                    <TableCell align="center">
                        <UpdateIcon
                            onClick={() => handleUpdate()} />
                    </TableCell>)}

                <TableCell align="center">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                {props.collapseTitle}
                            </Typography>
                            {props.numberOfTables.map((number, index) => {
                                return (
                                    <Table key={index} size="small" aria-label="purchases">
                                        <TableHead>
                                            <TableRow>
                                                {props.collapseHeads[index].map((head) => {
                                                    return <StyledTableCell align="center">{head}</StyledTableCell>
                                                })}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {props.collapseRows[index].map((singleRow, rowIndex) => {
                                                return (
                                                    <TableRow key={rowIndex}>{
                                                        props.collapseHeads[index].map((head, headIndex) => {
                                                            return (
                                                                <TableCell key={rowIndex + "" + headIndex} align="center">
                                                                    {singleRow[head] !== undefined && singleRow[head]}
                                                                    {singleRow[head] === undefined && singleRow}
                                                                </TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>)
                            }) 
                           }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
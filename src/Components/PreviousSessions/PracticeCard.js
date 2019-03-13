import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import DetailsDialog from "./DetailsDialog";

const styles = {
  card: {
    minWidth: 250,
    maxWidth: 250,
    backgroundColor: "#eff0f2"
    // margin: 15,
  },
  title: {
    fontSize: 24
  },
  grow: {
    flexGrow: 1
  }
};

function truncate(string) {
  const MAX_CHARS = 40
  if (string.length > MAX_CHARS) {
    return string.slice(0, MAX_CHARS) + "...";
  } else {
    return string;
  }
}

class PracticeCard extends Component {
  state = {
    dialogOpen: false,
  };
 

  render() {
    const { classes, data } = this.props;

    return (
      <Card className={classes.card}>

        <DetailsDialog
          open={this.state.dialogOpen}
          onClose={() => this.setState({ dialogOpen: false })}
          data={data}
        />

        <CardContent>
          <Typography variant="subtitle1"  color ="textSecondary">
            { moment(data.submit_time.toDate()).format("l") }
          </Typography>

          <Typography
            className={classes.title}
            variant="title"
            color = "textPrimary"
            gutterBottom
          >
            {truncate(data.goal)}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => this.setState({ dialogOpen: true })}
          >
            Details
          </Button>
          <div className={classes.grow} />
          {/* <Button size="small" color='secondary'>Delete</Button> */}
          {/* Delete Button should only be accessible for teachers */}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(PracticeCard);

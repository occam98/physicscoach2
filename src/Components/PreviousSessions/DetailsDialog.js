import React, { Component } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  GridList,
  GridListTile,
  TextField,
  CircularProgress
} from "@material-ui/core";
import PracticeImage from "../NewSession/PracticeImage";
//import Comment from "../PreviousSessions/Comment"
import Board from "../PreviousSessions/Board"
//import CommentThread from "./Comment";
import Lightbox from "react-images-zoom";
import { withStyles } from "@material-ui/core/styles";
import { GoalProgressIndicator } from "./GoalProgressIndicator";
import { formatMinutes } from "../../helpers/textUtils";
import { connect } from "react-redux";
import { userInfo } from "os";
import TeacherRoute from "../ProtectedRoutes/TeacherRoute";
import firebase from "../../config/constants";
const db = firebase.firestore();

const styles = {
  multilineColor: {
    color: "black"
  },
  notchedOutline: {
    color: "black !important",
    borderWidth: "1px",
    borderColor: "black !important"
  },
  openNotchedOutline: {
    color: "red !important",
    borderWidth: "1px",
    borderColor: "red !important"
  },
  closedNotchedOutline: {
    color: "green !important",
    borderWidth: "1px",
    borderColor: "green !important"
  },
  openAnswerNotchedOutline: {
    color: "blue !important",
    borderWidth: "1px",
    borderColor: "blue !important"
  },
  closedAnswerNotchedOutline: {
    color: "purple !important",
    borderWidth: "1px",
    borderColor: "purple !important"
  },
  label: {
    color: "black"
  },
  openLabel: {
    color: "red"
  },
  closedLabel: {
    color: "green"
  }
};

class DetailsDialog extends Component {
  state = {
    lightBoxOpen: false,
    teacherComment: this.props.practiceDoc.get("teacherComment"),
    currentImage: 0
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submit = async () => {
    await this.props.practiceDoc.ref.update({
      //Display the role of the commenter and display the message 
      teacherComment: (this.props.role.charAt(0).toUpperCase() + this.props.role.slice(1) + ": ") + this.state.teacherComment
    });

    //this.props.reLoad();
  };

  openLightBox = currentImage => {
    this.setState({ lightBoxOpen: true, currentImage: currentImage });
  };

  onClickPrev = () => {
    let index = this.state.currentImage;
    if (this.state.currentImage !== 0) {
      this.setState({ currentImage: index - 1 });
    }
  };

  onClickNext = () => {
    let index = this.state.currentImage;
    if (
      this.state.currentImage !==
      this.props.practiceDoc.get("imageList").length - 1
    ) {
      this.setState({ currentImage: index + 1 });
    }
  };

  onToggleChatWindow = () => {
    alert("Joshua");
  };

  onToggleQuestionOpen = () => {
    console.log('Toggling Question Open',this);
    this.setState({loading:true});
    this.props.practiceDoc.ref.update({
      isQuestionOpen: !this.props.practiceDoc.get("isQuestionOpen"),
    }).then(this.props.reLoad);
  };

  onToggleAnsweredOpen = () => {
    this.props.practiceDoc.ref.update({
      isAnsweredOpen: !this.props.practiceDoc.get("isAnsweredOpen"),
    }).then(this.props.reLoad);
  };

  render() {
    const { open, onClose, practiceDoc, classes } = this.props;
    const data = practiceDoc.data();
    const images = data.imageList.map(function (image) {
      return { src: image };
    });
    const loading = this.state.loading;
    this.state.loading = false;

    return (
      <div>
        <Lightbox
          images={images}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightBoxOpen}
          onClickPrev={this.onClickPrev}
          onClickNext={this.onClickNext}
          onClose={() => this.setState({ lightBoxOpen: false })}
          rotatable={true}
          zoomable={true}
        />

        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle align="center" id="timer-start-dialog">
            {data.goal}
          </DialogTitle>

          <DialogContent>
            <h5>Practice Length: {formatMinutes(data.practiceLength)} </h5>
            <h5>
              <GoalProgressIndicator rating={data.rating} format={"text"} />{" "}
              <GoalProgressIndicator rating={data.rating} format={"emoji"} />
            </h5>
            <TextField
              id="Practice-Note-TextField"
              label="Practice Note"
              value={data.practiceNote}
              fullWidth={true}
              readOnly={true}
              margin="normal"
              variant="outlined"
              multiline={true}
              disabled={true}
              InputProps={{
                classes: {
                  input: classes.multilineColor,
                  notchedOutline: classes.notchedOutline
                },
                color: "black"
              }}
            />
            <TextField
              id="Question-Comment-TextField"
              label="Question"
              value={data.questionComment}
              fullWidth={true}
              readOnly={true}
              margin="normal"
              variant="outlined"
              multiline={true}
              disabled={true}
              InputProps={{
                classes: {
                  input: classes.multilineColor,
                  notchedOutline: data.isQuestionOpen
                    ? classes.openNotchedOutline
                    : classes.closedNotchedOutline
                }
              }}
              InputLabelProps={{
                className: classes.openLabel
              }}
            />

            <GridList cols={4} style={{ marginTop: 20 }}>
              {data.imageList.map((image, index) => {
                return (
                  <GridListTile key={index}>
                    <PracticeImage
                      image={image}
                      index={index}
                      alt={"student work"}
                      deleteEnabled={false}
                      onClick={() => this.openLightBox(index)}
                    />
                  </GridListTile>
                );
              })}
            </GridList>
          </DialogContent>


          <DialogContent>

            {this.props.role === "student" && (
              <TextField
                id="Teacher-Comment-TextField"
                label="Teacher's Comments"
                value={data.teacherComment}
                fullWidth={true}
                readOnly={true}
                margin="normal"
                variant="outlined"
                multiline={true}
                disabled={true}
                InputProps={{
                  classes: {
                    input: classes.multilineColor,
                    notchedOutline: data.isQuestionOpen
                      ? classes.openAnswerNotchedOutline
                      : classes.closedAnswerNotchedOutline
                  }
                }}
                InputLabelProps={{
                  className: classes.openLabel
                }}
              />
            )}

          </DialogContent>
          {this.props.role === "teacher" && (
            <DialogContent>

              <TextField
                id="Teacher-Comment"
                name="teacherComment"
                label={data.teacherComment}
                fullWidth={true}
                placeholder={
                  data.teacherComment
                }
                multiline
                margin="normal"
                variant="outlined"
                onChange={this.onChange}
              />

            </DialogContent>
          )}

          <DialogContent><Board
            practiceDoc={practiceDoc}
          />
          </DialogContent>


          <DialogActions>
            {this.props.role === "teacher" && (
              <Button
                variant="contained"
                //onClick={this.onToggleAnsweredOpen}
                onClick={this.submit}
                color={data.isAnsweredOpen ? "primary" : "secondary"}
              >
                Add Comment
              </Button>
            )}


            {data.questionComment !== "" && (
              <Button
                variant="contained"
                onClick={this.onToggleQuestionOpen}
                color={data.isQuestionOpen ? "primary" : "secondary"}
              >
                {loading ? (<span style={{lineHeight:1.75}}><CircularProgress color='white' size='0.875rem' /></span>) : data.isQuestionOpen ? "Mark Question as Answered" : "Mark Question as Unanswered"}
              </Button>
            )}

            <Button variant="outlined" onClick={onClose} color="default">
              Close
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    );


  }
}
function mapStateToProps(state) {
  return {
    role: state.role,
    teacherComment: state.teacherComment
  };
}
export default connect(mapStateToProps)(withStyles(styles)(DetailsDialog));
//export default withStyles(styles)(DetailsDialog);
//export default CommentThread;

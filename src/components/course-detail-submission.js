// Submission Details of exercises solution
import React from "react";
import PropTypes from "prop-types";

import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

import CheckIcon from "@material-ui/icons/Check";
import { withStyles } from "@material-ui/core/styles";
import {  submitExerciseAPI } from '../services/api';
import {  getExerciseDetailFromSlug } from '../services/utils';

const styles = theme => {
  return {
    root: {
      flexGrow: 1,
    },
    cardContent:{
      paddingTop: theme.spacing.unit * 2,
      paddingBottom:theme.spacing.unit * 0,
      '&:last-child': {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit * 0.5,
      },
    },
    submitExercise: {
      marginTop:-theme.spacing.unit * 8,
      float: "right",
      color:"white",
      borderRadius:"8"
    },
    submissionField:{
      width:"90%",
      [theme.breakpoints.down("sm")]:{
        width:"90%",
      },
      [theme.breakpoints.down("xs")]:{
        width:"80%",
      },
    },
    floatRight:{
      float:"right",
    },
    typography:{
      display:"inline",
    },
    reviewer:{
      fontWeight:"400",
    }
  }
};

class CourseDetailSubmission extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes: "",
    }
  }

  isSubmissionTypeValid = (submissionType, notes) => {
    if (submissionType == "number") {
      return !isNaN(notes);
    } else if (submissionType == "text") {
      return notes.length <= 100;
    } else if (submissionType == "text_large") {
      return notes.length <= 1500;
    } else if (submissionType == "url") {
      if (!notes.startsWith("http")){
        return false
      } else {
        return notes.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null;
      }
    }
    return true;
  };

  submitExercise = event => {
    const { notes } = this.state;
    const { courseId, exercises, slug, loadExercise } = this.props;
    const { submissionType, id: exerciseId } = getExerciseDetailFromSlug(slug,exercises);

    // here should be the validation
    if (!this.isSubmissionTypeValid(submissionType, notes)) {
      // TODO: something to alert user
      let message;
      if (submissionType == "number") {
        message = `App nich ek integer value hi dal sakte hai.`;
      } else if (submissionType == "text") {
        message = `App niche 100 se jada character nhi dal sakte hai.`;
      } else if (submissionType == "text_large") {
        message = `App niche 1500 se jada character nhi dal sakte hai.`;
      } else if (submissionType == "url") {
          message =  (!notes.startsWith("http"))?
                  `Link ke aage http:// yea https:// hona chaiye.`
                  : `Apko niche ek url ka link dalna hai.`;
      }
      alert(message);
      return;
    }
      submitExerciseAPI(courseId, exerciseId, notes);
      loadExercise();
  }

  // handle the text in the input
  handleChange = event => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  };

  render(){
    const {
      classes,
      prevSolutionDetail,
    } = this.props;
    console.log(prevSolutionDetail);
    const reviewrs = ["peer", "facilitator", "automatic"];
    return (
      <Card>
        {/*previously submitted notes*/}
          {
            prevSolutionDetail?
            <CardContent className={classes.cardContent}>
              <Typography variant="body2" className={classes.typography}>
                Previous Solution:
              </Typography>
              {
                prevSolutionDetail.reviewerName?
                <Typography variant="body2" className={`${classes.typography} ${classes.floatRight}`}>
                  Reviewer Name: <span className={classes.reviewer}>{prevSolutionDetail.reviewerName}</span>
                </Typography>
                :null
              }

              <Typography className={classes.solution} variant="body1">
                {
                  prevSolutionDetail.submitterNotes.startsWith("http")?
                  <a href={prevSolutionDetail.submitterNotes} target="_blank">
                    Solution
                  </a>
                  :prevSolutionDetail.submitterNotes
                }
              </Typography>
            </CardContent>
            : null
          }

        {/*submission form*/}
        <CardContent className={classes.cardContent}>
          <form autoComplete="off">
            <TextField
              multiline={true}
              fullWidth
              value={this.state.notes}
              label={"Exercise Submission"}
              onChange={this.handleChange}
              className={classes.submissionField}
              name="notes"
              />
            <br />
            <br />
            <Button
              variant="extendedFab"
              color="secondary"
              className={classes.submitExercise}
              onClick={this.submitExercise}
              >
              <img src="/static/icons/icons8-upload-to-cloud-24.png" />
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
}

CourseDetailSubmission.propTypes = {
  classes: PropTypes.object.isRequired,
  prevSolutionDetail: PropTypes.object
};

export default withStyles(styles)(CourseDetailSubmission);

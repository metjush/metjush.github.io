# Comparing Facial Emotion Recognition Technology

This report compares the results of our internal test of three facial emotion recognition technologies from different vendors. We had each technology analyze the same set of test videos. Next, we compared the results, looking for congruence between the technologies, for markers of instability or failure, and for consistency. We present preliminary results of this analysis, concluding that the state of the art of facial emotion recognition is currently only suited for highly controlled environments where very clear and expressive emotions are the point of detection and analysis. As such, we wouldn't at this point recommend it for the purpose of analyzing subtle changes in emotion during a psychodiagnostic test administered online, without any control over the recording conditions.

## Technology Vendors

We compared technology from three separate vendors: _Emotient_, _IntraFace_ and _Noldus_. We utilized trial versions (free minute allowance in the case of _Emotient_) from all the vendors. We've been in direct contact with all of them to a greater or lesser extent. 

### Emotient

_Emotient_ is an online service for analyzing sentiment, attention and engagement in video recordings. We have used their product demo and their free allowance of 15 minutes of video to conduct our tests. We have also been in touch with _Emotient_ with regards to pricing. _Emotient_ is a purely cloud-based service, without the option of running the analysis on your own servers. The analysis is not real-time (it usually takes a few minutes for a short video to be analyzed). The primary reporting is visual, with the option of exporting the raw data in a text (CSV) format.

### IntraFace

_IntraFace_ is a product spun off from the _Carnegie Mellon University_ in Pittsburgh, PA. It is an offline product (a C++ library) for face detection and emotion analysis. It builds on research conducted in the _Human Sensing_ laboratory of the CMU's School of Computer Science. However, it is now an independent commercial product. We have been in extensive communication with the founder (Fernando De la Torre) about pricing, the future plans with the product (it is still undergoing active development). It was also technically the most difficult to set up, as we had to implement the interface and reporting tools ourselves, using the provided trial version of the library. As such, we were able to fully customize the output as a CSV file.

### Noldus FaceReader

_Noldus_, a Dutch company, makes _FaceReader_, software designed primarily for marketers and researchers (in controlled lab settings) for analyzing emotions from facial expressions. They provide both an offline version, and an online cloud-based service. We have exchanged several emails and held a Skype call with Noldus to go over the details of implementing their solution, as well as their pricing terms. We have used the trial version of their offline software to conduct our tests. The output is primarly visual in the software itself, but it allows for export to a text (TXT) file.

## Methodology

We have first recorded a set of seven (7) short videos that varied in expresiveness, lighting conditions and whether the subject on camera wore glasses or not. Some were supposed to be very neutral, some very expressive, some only involved mouth movements, some incorporated eye expressions. One (called the _edge case_ video) was designed to test the extremes of the technology: a very highly-moving subject, constantly changing facial expressions. The videos were recorded on a standard USB web camera from Microsoft to simulate the possible lower end of the quality spectrum of what our actual candidates may use. 

Secondly, we also recorded a video of a subject actually taking a psychodiagnostic test online to simulate more realistically the range of emotions and movements that our candidates may exhibit during a test. This was a longer video with appropriate lighting conditions and a slightly better mid-range USB web camera. The subject wore glasses during the test as we cannot expect candidates who need glasses to take them off for a substantial amount of time where their sight cannot be impaired.

Then, we used the three technologies to analyze these videos. We then gathered the results and combined them into comparable spreadsheets that allowed for side-by-side analysis.

## Hypotheses

Prior to going into these tests, we formulated several hypotheses that we considered critical for us to be able to use this technology in production.

1. The results of the three technologies on an identical recorded video will not vary substantially. Specifically, the shares of the positive, negative and neutral emotions will not be significantly different.
2. The technologies are able to identify a face despite less than ideal conditions: with low lighting, when the subject wears glasses, etc. 
3. The ability of the technologies to identify a face will not vary significantly across the three vendors.

As we want to choose a vendor (and a technology) that we can vouch for, and the we can have confidence in that it provides reliable results to our clients, we decided that if we find no support for these hypotheses in the analysis, we would prefer not to use facial expression analysis at this point rather than use an unreliable solution.

## Data Preparation

Before comparing the results, we needed to standarize results from the three vendors so that they can be compared side-by-side. This section describes the necessary steps we needed to take to make that possible.

### Differences in time frames

First problem we encountered was when comparing results from _Emotient_ and _IntraFace_. In several videos, _IntraFace_ results produced approximately ten times fewer entries (frames) than those of _Emotient_. The test videos were recorded at a rather low frame rate (approx. `4 fps`). However, it apperead that _Emotient_ had treated the videos as standard `30 fps` videos and somehow extrapolated the frames to match this frame rate. Therefore, to be able to correlate the results and compare them graphically, we had to downsample _Emotient_ results to a size that was comparable to that of _IntraFace_. 

The heuristic used was as follows: only keep frames from the _Emotient_ results, timestamp of which is sufficiently close to at least one timestamp in the _IntraFace_ results. Sufficiently cňlose was defined as "the difference between the _Emotient_ timestamp and the _IntraFace_ timestamp is less than `epsilon`", where `epsilon` is an arbitrarily chosen small number. After a few tries, the `epsilon` parameter that most accurately downsampled the results was found to be `0.0007s` (or, more generally, between `0.001s` and `0.0005s`).

### Differences in specific emotions

Each technology used uses a slightly different set of emotions to classify the video. _IntraFace_ uses a set of five basic emotions: **Anger**, **Disgust**, **Joy**, **Sadness** and **Surprise**. _Emotient_ adds **Confusion**, **Contempt** and **Frustration**. _Noldus_ classifies **Joy**, **Sadness**, **Fear**, **Disgust**, **Surprise**, **Anger** and **Contempt**. All technologies also classify **Neutral** as a sort of a baseline emotion.

Given these differences, it wasn't possible to reliably compare results in individual emotions. The primary reason is this. Suppose we group all the emotions into **positive** and **negative** bins. (See table below.) Also suppose that all three classifiers agree perfectly on whether a person has a positive, negative or neutral emotion. Then, having decided that the emotion is negative, each classifier has a different set of options to assign the expression into. While _IntraFace_ can only choose between **Anger**, **Disgust** and **Sadness**, the other two classifiers have more options. Assuming the classifiers _need_ to assign some emotion to the expression, the _Independence of Irrelevant Alternatives_ fails in this example and specific results from different classifiers are thus not comparable.

| Emotion | Vendors | Category |
| --- | --- | --- |
| Joy | all | Positive |
| Surprise | all | Positive |
| Anger | all | Negative |
| Disgust | all | Negative |
| Sadness | all | Negative |
| Confusion | Emotient | Negative |
| Contempt | Emotient and Noldus | Negative |
| Frustration | Emotient | Negative |
| Fear | Noldus | Negative |

As we can see, this only affects negative emotions. Nonetheless, we have decide to only compare classification into the large emotional bins of **positive**, **negative** and **neutral**. 

(This is also necessary as - having only discovered this during the analysis - _IntraFace_ hasn't implemented the **Anger** emotion yet.)

## Results

### Failure of Noldus

Prior to comparing specific results in the different tests, one technology rejected the latter two hypotheses from the outset. _Noldus_ had significant problems with detecting a face, especially when the subject wore glasses or when their head was even slightly tilted or turned. We attempted calibration, but to no avail. Given the lackluster performance in identifying a face, the results produced by Noldus were unusable and we thus decided not to use them in further analysis.

### First seven videos

As mentioned in `Data Preparation` above, we will limit our analysis to comparing general emotional categories: **positive**, **negative** and **neutral**. Overall, the shares of emotions assigned to these bins were relatively similar. The table below shows the different videos with the respective emotions assigned by _Emotient_ and _Noldus_:

| | One | Two | Three | Four | Five | Six | Seven |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Positive Emotient | 1.0% | 0.4% | 27.1% | 27.5% | 9.9% | 21.5% | 38.9%
| Positive IntraFace | 4.0% | 0.9% | 31.0% | **47.6%** | 14.3% | 22.5% | 46.7%
| Negative Emotient | 21.5% | 24.5% | 48.1% | 63.5% | 50.2% | 51.1% | 36.4%
| Negative IntraFace | 16.9% | 9.5% | 30.5% | **34.6%** | 46.2% | **25.6%** | 20.4%
| Neutral Emotient | 77.5% | 75.1% | 24.8% | 9.0% | 39.9% | 27.4% | 24.7%
| Neutral IntraFace | 79.1% | 89.6% | 38.6% | **17.9%** | 39.5% | **51.9%** | 32.9%

We can see that only in the fourth and the sixth video were there any major discrepancies between the categories. However, having no "ground truth" to compare the results with, there is only so far comparisons like these can take us. They don't allow us to ascertain the accuracy of the two classifiers, only whether they agree. And on the very broad level of positive/negative/neutral they seem to do. 

Granted, when one looks at graphs of the positive/negative/neutral scores over time, there are apparent inconsistencies. As an example, here's the graphs depicting positive, negative and neutral emotions over time in the sixth video:

![Graph Video 6](https://www.dropbox.com/s/se6lva172o7064w/Screenshot%202015-11-24%2010.55.37.png?dl=0 "Emotions in Video 6")

It is clear that the two lines don't perfectly match up. Specifically, _IntraFace_ appears to be more "jittery" - changing emotions more often, perhaps being more sensitive to smaller changes in expression.

### Test taking video

The second test came in form of a recording from actual questionnaire taking. A subject was recorded while taking a psychodiagnostic test on a computer. The video is approximately 8 minutes long. Just at a glance, the subject appeared rather neutral, disengaged or perhaps slightly bored when taking the test. That's why the results from _Emotient_ and _IntraFace_ surprised us (_Noldus_ again failed to identify the face for most of the recording). Specifically, there was a large disconnect between the base results of _Emotient_ and _IntraFace_:

| | Emotient | IntraFace |
| Positive | 13.7% | 4.1% |
| Negative | **74.4%** | 2.5% | 
| Neutral | 11.9% | **93.4%** |

While _Emotient_ classified a large part of the video as negative (with **Sadness** and **Confusion** making up the vast majority of that, over 58%), _IntraFace_ was overwhelmingly neutral. If anything, there were more positive than negative emotions in the _IntraFace_ results (**Joy** was the dominant emotion with 3.2%, followed by **Sadness** at 2.0%). 

Given that this was a video that was supposed to represent our standard use case, the results shocked us. The numbers themselves are of secondary concern (the subject may well have been sad and confused - or bored, which could manifest as the two former emotions), the discrepancy is the primary concern. Unlike the videos in the first test, where the discrepancies were mostly minor, this is a significant difference in identifying the dominant sentiment in the video.





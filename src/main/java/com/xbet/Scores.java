
package com.xbet;

import org.codehaus.jackson.annotate.JsonProperty;

import java.util.List;

public class Scores {
  private String courseOfPlay;
  private String currPeriodStr;
  private Number currentPeriod;
  private FullScore fullScore;
  private String info;
  private List<PeriodScores> periodScores;
  private Number podacha;
  private String statistic;
  private SubScore subScore;
  private boolean timeDirection;
  private boolean timeRun;
  private Number timeSec;
  private String __type;


  public String getCourseOfPlay() {
    return this.courseOfPlay;
  }

  @JsonProperty("CourseOfPlay")
  public void setCourseOfPlay(String courseOfPlay) {
    this.courseOfPlay = courseOfPlay;
  }

  public String getCurrPeriodStr() {
    return this.currPeriodStr;
  }

  @JsonProperty ("CurrPeriodStr")
  public void setCurrPeriodStr(String currPeriodStr) {
    this.currPeriodStr = currPeriodStr;
  }

  public Number getCurrentPeriod() {
    return this.currentPeriod;
  }

  @JsonProperty("CurrentPeriod")
  public void setCurrentPeriod(Number currentPeriod) {
    this.currentPeriod = currentPeriod;
  }

  public FullScore getFullScore() {
    return this.fullScore;
  }

  @JsonProperty("FullScore")
  public void setFullScore(FullScore fullScore) {
    this.fullScore = fullScore;
  }

  public String getInfo() {
    return this.info;
  }

  @JsonProperty("Info")
  public void setInfo(String info) {
    this.info = info;
  }

  public List<PeriodScores> getPeriodScores() {
    return this.periodScores;
  }

  @JsonProperty("PeriodScores")
  public void setPeriodScores(List<PeriodScores> periodScores) {
    this.periodScores = periodScores;
  }

  public Number getPodacha() {
    return this.podacha;
  }

  @JsonProperty("Podacha")
  public void setPodacha(Number podacha) {
    this.podacha = podacha;
  }

  public String getStatistic() {
    return this.statistic;
  }

  @JsonProperty("Statistic")
  public void setStatistic(String statistic) {
    this.statistic = statistic;
  }

  public SubScore getSubScore() {
    return this.subScore;
  }

  @JsonProperty("SubScore")
  public void setSubScore(SubScore subScore) {
    this.subScore = subScore;
  }

  public boolean getTimeDirection() {
    return this.timeDirection;
  }


  @JsonProperty("TimeDirection")
  public void setTimeDirection(boolean timeDirection) {
    this.timeDirection = timeDirection;
  }

  public boolean getTimeRun() {
    return this.timeRun;
  }

  @JsonProperty("TimeRun")
  public void setTimeRun(boolean timeRun) {
    this.timeRun = timeRun;
  }

  public Number getTimeSec() {
    return this.timeSec;
  }

  @JsonProperty("TimeSec")
  public void setTimeSec(Number timeSec) {
    this.timeSec = timeSec;
  }


  public String get__type() {
    return this.__type;
  }

  @JsonProperty("__type")
  public void set__type(String __type) {
    this.__type = __type;
  }
}

package com.xbet;

import be.belgampaul.tennis.domain.tennis.ScoreboardUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import java.util.Arrays;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Value {
  private String animCode;
  private String animParam;
  private Number before;
  private String champ;
  private Number cont;
  private List<Events> events;
  private boolean finished;
  private String gameType;
  private String gameVid;
  private Number id;
  private Number isTourn;
  private Number ligaId;
  private Number mainGameId;
  private String nameGame;
  private Number num;
  private String opp1;
  private String opp2;
  private Number period;
  private String periodName;
  private Number risk;
  private Scores scores;
  private Number sportId;
  private String sportName;
  private Number start;
  private String tvChannel;
  private boolean vA;
  private String vI;
  private Number zonePlay;

  public String getAnimCode() {
    return this.animCode;
  }

  @JsonProperty("AnimCode")
  public void setAnimCode(String animCode) {
    this.animCode = animCode;
  }

  public String getAnimParam() {
    return this.animParam;
  }

  @JsonProperty("AnimParam")
  public void setAnimParam(String animParam) {
    this.animParam = animParam;
  }

  public Number getBefore() {
    return this.before;
  }

  @JsonProperty("Before")
  public void setBefore(Number before) {
    this.before = before;
  }

  public String getChamp() {
    return this.champ;
  }

  @JsonProperty("Champ")
  public void setChamp(String champ) {
    this.champ = champ;
  }

  public Number getCont() {
    return this.cont;
  }

  @JsonProperty("Cont")
  public void setCont(Number cont) {
    this.cont = cont;
  }

  public List<Events> getEvents() {
    return this.events;
  }

  @JsonProperty("Events")
  public void setEvents(List<Events> events) {
    this.events = events;
  }

  public boolean getFinished() {
    return this.finished;
  }

  @JsonProperty("Finished")
  public void setFinished(boolean finished) {
    this.finished = finished;
  }

  public String getGameType() {
    return this.gameType;
  }

  @JsonProperty("GameType")
  public void setGameType(String gameType) {
    this.gameType = gameType;
  }

  public String getGameVid() {
    return this.gameVid;
  }

  @JsonProperty("GameVid")
  public void setGameVid(String gameVid) {
    this.gameVid = gameVid;
  }

  public Number getId() {
    return this.id;
  }

  @JsonProperty("Id")
  public void setId(Number id) {
    this.id = id;
  }

  public Number getIsTourn() {
    return this.isTourn;
  }

  @JsonProperty("IsTourn")
  public void setIsTourn(Number isTourn) {
    this.isTourn = isTourn;
  }

  public Number getLigaId() {
    return this.ligaId;
  }

  @JsonProperty("LigaId")
  public void setLigaId(Number ligaId) {
    this.ligaId = ligaId;
  }

  public Number getMainGameId() {
    return this.mainGameId;
  }

  @JsonProperty("MainGameId")
  public void setMainGameId(Number mainGameId) {
    this.mainGameId = mainGameId;
  }

  public String getNameGame() {
    return this.nameGame;
  }

  @JsonProperty("NameGame")
  public void setNameGame(String nameGame) {
    this.nameGame = nameGame;
  }

  public Number getNum() {
    return this.num;
  }

  @JsonProperty("Num")
  public void setNum(Number num) {
    this.num = num;
  }

  public String getOpp1() {
    return this.opp1;
  }

  @JsonProperty("Opp1")
  public void setOpp1(String opp1) {
    this.opp1 = opp1;
  }

  public String getOpp2() {
    return this.opp2;
  }

  @JsonProperty("Opp2")
  public void setOpp2(String opp2) {
    this.opp2 = opp2;
  }

  public Number getPeriod() {
    return this.period;
  }

  @JsonProperty("Period")
  public void setPeriod(Number period) {
    this.period = period;
  }

  public String getPeriodName() {
    return this.periodName;
  }

  @JsonProperty("PeriodName")
  public void setPeriodName(String periodName) {
    this.periodName = periodName;
  }

  public Number getRisk() {
    return this.risk;
  }

  @JsonProperty("Risk")
  public void setRisk(Number risk) {
    this.risk = risk;
  }

  public Scores getScores() {
    return this.scores;
  }

  @JsonProperty("Scores")
  public void setScores(Scores scores) {
    this.scores = scores;
  }

  public Number getSportId() {
    return this.sportId;
  }

  @JsonProperty("SportId")
  public void setSportId(Number sportId) {
    this.sportId = sportId;
  }

  public String getSportName() {
    return this.sportName;
  }

  @JsonProperty("SportName")
  public void setSportName(String sportName) {
    this.sportName = sportName;
  }

  public Number getStart() {
    return this.start;
  }

  @JsonProperty("Start")
  public void setStart(Number start) {
    this.start = start;
  }

  public String getTvChannel() {
    return this.tvChannel;
  }

  @JsonProperty("TvChannel")
  public void setTvChannel(String tvChannel) {
    this.tvChannel = tvChannel;
  }

  public boolean getVA() {
    return this.vA;
  }

  @JsonProperty("VA")
  public void setVA(boolean vA) {
    this.vA = vA;
  }

  public String getVI() {
    return this.vI;
  }

  @JsonProperty("VI")
  public void setVI(String vI) {
    this.vI = vI;
  }

  public Number getZonePlay() {
    return this.zonePlay;
  }

  @JsonProperty("ZonePlay")
  public void setZonePlay(Number zonePlay) {
    this.zonePlay = zonePlay;
  }

  @JsonIgnore
  public String getStrictScore() {
    StringBuilder stringBuilder = new StringBuilder();
    List<String> strictScore = Arrays.asList(new String[]{"0:0", "0:0", "0:0", "0:0", "0:0", "0:0", "0:0"});


    FullScore fullScore = this.scores.getFullScore();
    String sc1 = fullScore.getSc1();
    String sc2 = fullScore.getSc2();
    strictScore.set(0, sc1 + ":" + sc2);


    int cnt = 1;
    List<PeriodScores> periodScores = this.scores.getPeriodScores();
    for (PeriodScores periodScore : periodScores) {
      PeriodScores.Value _value = periodScore.getValue();
      strictScore.set(cnt, _value.getSc1() + ":" + _value.getSc2());
      cnt++;
    }
    Number service = this.scores.getPodacha();
    String s1 = (service != null) && (service.equals(new Integer(1))) ? "*" : "";
    String s2 = (service != null) && (service.equals(new Integer(2))) ? "*" : "";

    String sc11 = this.scores.getSubScore().getSc1();
    String sc22 = this.scores.getSubScore().getSc2();

    String sc111 = ScoreboardUtils.convertAdvFormatToNumber(sc11);

    String sc222 = ScoreboardUtils.convertAdvFormatToNumber(sc22);

    strictScore.set(6, s1+sc11 + ":" + sc22+s2);
    return StringUtils.join(strictScore, ";");
  }

  public String toString() {
    StringBuilder sb = new StringBuilder();
    Number id = getId();
    String opp1 = getOpp1();
    String opp2 = getOpp2();
    Scores scores = getScores();
    FullScore fullScore = scores.getFullScore();
    String sc1 = fullScore.getSc1();
    String sc2 = fullScore.getSc2();

    sb.append(id).append(" ");
    sb.append(opp1).append(" vs ").append(opp2);

    sb.append("");

    sb.append(sc1).append(":").append(sc2);

    sb.append("");

    List<PeriodScores> periodScores = scores.getPeriodScores();
    for (PeriodScores periodScore : periodScores) {
      PeriodScores.Value _value = periodScore.getValue();
      sb.append("(" + _value.getSc1() + ":" + _value.getSc2() + ")");
    }
    sb.append("");


    Number podacha = scores.getPodacha();

    String s1 = (podacha != null) && (podacha.equals(new Integer(1))) ? "*" : "";
    String s2 = (podacha != null) && (podacha.equals(new Integer(2))) ? "*" : "";

    sb.append(s1).append(scores.getSubScore().getSc1()).append(":").append(scores.getSubScore().getSc2()).append(s2);

    sb.append("");

    return sb.toString();
  }
}
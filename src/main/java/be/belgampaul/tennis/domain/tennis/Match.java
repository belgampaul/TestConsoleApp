package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.ETennisGameType;
import be.belgampaul.tennis.domain.Player;
import com.xbet.Value;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

public class Match
    extends AbstractTennisMatchObject<Tournament, Set> {
  private Player player1;
  private Player player2;

  public Match(Long id, Tournament tournament, Player player1, Player player2) {
    super(id, tournament);
    this.player1 = player1;
    this.player2 = player2;
    this.gameType = ETennisGameType.STANDARD;
  }

  public Match(Value v) {
    super(Long.valueOf(v.getId().longValue()), null);
    this.player1 = new Player(v.getOpp1(), "");
    this.player2 = new Player(v.getOpp2(), "");
    String strictScore = v.getStrictScore();

    List<String> scores = Arrays.asList(strictScore.split(";"));

    String[] scoreSet1 = ((String) scores.get(1)).split(":");


    System.err.println(v.getStrictScore());
  }

  public void setCurrentPointWinner(Player player) {
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      currentPoint.setWinner(player);
    }
  }

  protected void calculateResult() {
    if (getWinner() != null) {
      return;
    }
    switch (gameType) {
      case STANDARD:
        Set last = (Set) this.children.getLast();
        int scorePlayer1 = 0;
        int scorePlayer2 = 0;
        for (Set child : this.children) {
          scorePlayer1 = child.getWinner().equals(getPlayer1()) ? scorePlayer1 + 1 : scorePlayer1;
          scorePlayer2 = child.getWinner().equals(getPlayer2()) ? scorePlayer2 + 1 : scorePlayer2;
        }
        if (isMatchFinished(scorePlayer1, scorePlayer2)) {
          setWinner(scorePlayer1 - scorePlayer2 > 0 ? getPlayer1() : getPlayer2());
        } else {
          createNextSet(scorePlayer1, scorePlayer1);
        }
        break;
    }
  }

  private void createNextSet(int scorePlayer1, int scorePlayer11) {
    int id = this.children.size() + 1;
    Set set = new Set(Long.valueOf(id), this);
    if (id % 2 == 1) {
      set.init(this.toServeFirst, this.toReceiveFirst);
    } else {
      set.init(this.toReceiveFirst, this.toServeFirst);
    }
    set.addPropertyChangeListener(this.propertyChangeListener);
    this.children.add(set);
  }

  private boolean isMatchFinished(int scorePlayer1, int scorePlayer2) {
    return (scorePlayer1 + scorePlayer2 > 2) || (Math.abs(scorePlayer1 - scorePlayer2) > 1);
  }

  public Player getPlayer1() {
    return this.player1;
  }

  public void setPlayer1(Player player1) {
    this.player1 = player1;
  }

  public Player getPlayer2() {
    return this.player2;
  }

  public Player getCurrentServer() {
    return this.currentServer;
  }

  public void init(Player serveFirst, Player receiveFirst) {
    if (this.children.size() == 0) {
      Set set = new Set(Long.valueOf(1L), this);
      this.children.add(set);
      set.init(serveFirst, receiveFirst);
      set.addPropertyChangeListener(this.propertyChangeListener);
    }
  }

  public void setPlayer2(Player player2) {
    this.player2 = player2;
  }

  public String getNotStrictScore() {
    List<String> strictScore = Arrays.asList(new String[]{"0:0", "0:0", "0:0", "0:0", "0:0", "0:0", "0:0"});


    strictScore.set(0, getPlayer1Score() + ":" + getPlayer2Score());


    int cnt = 1;
    for (Set score : this.children) {
      strictScore.set(cnt, score.getPlayer1Score() + ":" + score.getPlayer2Score());
      cnt++;
    }
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      String player1Score = currentPoint.getPlayer1ScoreAdvFormat();
      String player2Score = currentPoint.getPlayer2ScoreAdvFormat();
      strictScore.set(6, player1Score + ":" + player2Score);
    } else {
      strictScore.set(6, "0:0");
    }
    return StringUtils.join(strictScore, ";");
  }

  public String getStrictScore() {
    List<String> strictScore = Arrays.asList(new String[]{"0:0", "0:0", "0:0", "0:0", "0:0", "0:0", "0:0"});
    strictScore.set(0, getPlayer1Score() + ":" + getPlayer2Score());

    int cnt = 1;
    for (Set score : this.children) {
      strictScore.set(cnt, score.getPlayer1Score() + ":" + score.getPlayer2Score());
      cnt++;
    }
    Point currentPoint = getCurrentPoint();
    if (currentPoint != null) {
      strictScore.set(6, currentPoint.getPlayer1Score() + ":" + currentPoint.getPlayer2Score());
    } else {
      strictScore.set(6, "0:0");
    }
    return StringUtils.join(strictScore, ";");
  }
}
package com.nhl.json.live;

import com.nhl.json.live.Game;

import java.util.List;

/**
 * User: ikka
 * Date: 4/2/14
 * Time: 6:15 AM
 */
public class Scoreboard {
  private int startIndex;
  private int refreshInterval;

  private List<Game> games;

  public int getStartIndex() {
    return startIndex;
  }

  public void setStartIndex(int startIndex) {
    this.startIndex = startIndex;
  }

  public int getRefreshInterval() {
    return refreshInterval;
  }

  public void setRefreshInterval(int refreshInterval) {
    this.refreshInterval = refreshInterval;
  }

  public List<Game> getGames() {
    return games;
  }

  public void setGames(List<Game> games) {
    this.games = games;
  }
}

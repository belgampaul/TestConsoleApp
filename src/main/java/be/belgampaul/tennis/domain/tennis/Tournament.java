package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.Player;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 4:06 AM
 */
public class Tournament extends AbstractTennisObject<Tournament> implements ITennisMatch{

  protected Tournament(Long id, Tournament tournament) {
    super(id, tournament);
  }

  @Override
  protected void calculateResult() {

  }

  @Override
  public Player getPlayer1() {
    throw new UnsupportedOperationException();
  }

  @Override
  public Player getPlayer2() {
    throw new UnsupportedOperationException();
  }

  @Override
  public String getPlayer1Score() {
    return null;
  }

  @Override
  public String getPlayer2Score() {
    return null;
  }

  @Override
  public Player getCurrentServer() {
    throw new UnsupportedOperationException();
  }

  @Override
  public Point getCurrentPoint() {
    throw new UnsupportedOperationException();
  }

  @Override
  public Boolean isMatchCompleted() {
    throw new UnsupportedOperationException();
  }

  @Override
  public Boolean isCompleted() {
    return null;
  }
}

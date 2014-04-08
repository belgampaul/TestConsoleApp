package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.constants.TennisConstants;
import be.belgampaul.tennis.domain.ETennisGameType;
import be.belgampaul.tennis.domain.Player;
import org.apache.log4j.Logger;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 3:44 AM
 */
public class Set extends AbstractTennisMatchObject<Match, Game> {
  //logger
  private static final Logger log = Logger.getLogger(Set.class);

  public Set(Long id, Match match) {
    super(id, match);
    gameType = ETennisGameType.STANDARD;
  }

  @Override
  protected void calculateResult() {
    log.debug("Game " + children.getLast().getId() + " + is won by " + children.getLast().getWinner().getLastName());
    if (getWinner() != null) {
      return;
    }
    switch (gameType) {
      case STANDARD:

        Game last = children.getLast();
        int scorePlayer1 = 0;
        int scorePlayer2 = 0;
        for (Game child : children) {
          scorePlayer1 = child.getWinner().equals(getPlayer1()) ? scorePlayer1 + 1 : scorePlayer1;
          scorePlayer2 = child.getWinner().equals(getPlayer2()) ? scorePlayer2 + 1 : scorePlayer2;
        }
        if (isSetFinished(scorePlayer1, scorePlayer2)) {
          setWinner(scorePlayer1 - scorePlayer2 > 0 ? getPlayer1() : getPlayer2());
        } else {
          createNextGame(scorePlayer1, scorePlayer1);
        }
    }
  }

  private boolean isSetFinished(int scorePlayer1, int scorePlayer2) {
    return children.size() == TennisConstants.MAX_GAMES_IN_SET
        || ((scorePlayer1 > 5 || scorePlayer2 > 5)
        && Math.abs(scorePlayer1 - scorePlayer2) >= TennisConstants.MINIMAL_GAMES_DIFFERENCE_IN_SET);
  }

  @Override
  public void init(Player serveFirst, Player receiveFirst) {
    super.init(serveFirst, receiveFirst);
    if (children.size() == 0) {
      Game game = new Game(1L, this);
      children.add(game);
      game.init(serveFirst, receiveFirst);
      game.addPropertyChangeListener(propertyChangeListener);
    }
  }

  private void createNextGame(Integer scoreAfterPointPlayer1, Integer scoreAfterPointPlayer2) {
    int id = children.size() + 1;
    Game game = new Game((long) id, this);
    if (id % 2 == 1) {
      game.init(toServeFirst, toReceiveFirst);
    } else {
      game.init(toReceiveFirst, toServeFirst);
    }

    game.addPropertyChangeListener(propertyChangeListener);
    children.add(game);
  }

  public Game createNextGame(Player toServe, Player toReceive) {
    Game game = new Game(children.size() + 1L, this);
    game.init(toServe, toReceive);
    game.setCurrentServer(toServe);
    game.addPropertyChangeListener(propertyChangeListener);

    children.add(game);
    return game;
  }
}
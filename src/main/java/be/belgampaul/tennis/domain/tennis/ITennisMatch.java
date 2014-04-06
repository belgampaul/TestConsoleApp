package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.ICompletable;
import be.belgampaul.tennis.domain.Player;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 4:42 PM
 */
public interface ITennisMatch extends ICompletable {
  Player getPlayer1();
  Player getPlayer2();
  String getPlayer1Score();
  String getPlayer2Score();
  Player getCurrentServer();
  Point getCurrentPoint();
  Player getWinner();
}

package be.belgampaul.tennis.domain.tennis;

import be.belgampaul.tennis.domain.Player;

import java.util.ArrayList;

/**
 * User: ikka
 * Date: 4/7/14
 * Time: 4:35 AM
 */
public class ScoreboardUtils {
  public static String convertAdvFormatToNumber(String score) {
    return score.equals("ADV") ? "4" : score.equals("40") ? "3" : score.equals("30") ? "2" : score.equals("15") ? "1" : score.equals("0") ? "0" : score;
  }

  public static Long calculateScore(ArrayList<String> pParts) {
    long[] multipliers = {(long) Math.pow(10, 13), (long) Math.pow(10, 11), (long) Math.pow(10, 9), (long) Math.pow(10, 7), (long) Math.pow(10, 5), (long) Math.pow(10, 3), 1};
    long score = 0L;
    int cnt = 0;
    for (final String pPart : pParts) {
      String _pPart = pPart;
      if (pPart.equals("ADV")) {
        _pPart = "50";
      }
      Long _score = Long.parseLong(_pPart) * multipliers[cnt];
      score += _score;
      cnt++;
    }
    return score;
  }

  /**
   * @param toServe - player to serve
   * @param player1 - a player, order is not important
   * @param player2 - a player, order is not important
   * @return player to receive
   */
  public static Player getReceiver(Player toServe, Player player1, Player player2) {
    return (toServe == null || player1 == null || player2 == null) ? null :
        player1.equals(toServe) ? player2 : player1;
  }
}

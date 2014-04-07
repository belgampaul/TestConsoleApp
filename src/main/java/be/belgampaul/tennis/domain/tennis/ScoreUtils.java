package be.belgampaul.tennis.domain.tennis;

/**
 * User: ikka
 * Date: 4/7/14
 * Time: 4:35 AM
 */
public class ScoreUtils {
  public static String convertAdvFormatToNumber(String score) {
    return score.equals("ADV") ? "4" : score.equals("40") ? "3" : score.equals("30") ? "2" : score.equals("15") ? "1" : score.equals("0") ? "0" : score;
  }
}

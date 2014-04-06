package be.belgampaul.tennis.domain.exceptions;

/**
 * User: ikka
 * Date: 4/6/2014
 * Time: 4:00 AM
 */
public class ValidationException extends Exception {
  public ValidationException(String msg) {
    super(msg);
  }
}

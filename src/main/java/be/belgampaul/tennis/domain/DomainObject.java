package be.belgampaul.tennis.domain;

import be.belgampaul.tennis.domain.exceptions.ValidationException;

/**
 * User: ikka
 * Date: 4/5/2014
 * Time: 3:07 AM
 */
public abstract class DomainObject {
  protected Long id;

  protected DomainObject(Long id) {
    this.id = id;
  }

  protected DomainObject() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void validate() throws ValidationException {
      if (id == null) {
        throw new ValidationException("id is null");
      }
  }
}
